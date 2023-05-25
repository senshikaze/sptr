import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, of, throwError, timer } from 'rxjs';
import { catchError, map, retry, take } from 'rxjs/operators';
import { Ship } from '../interfaces/ship';
import { Agent } from '../interfaces/agent';
import { Response } from '../interfaces/response';
import { Waypoint } from '../interfaces/waypoint';
import { System } from '../interfaces/system';
import { Register } from '../interfaces/register';
import { Contract } from '../interfaces/contract';
import { DateTime } from 'luxon';
import { Router } from '@angular/router';
import { Survey } from '../interfaces/survey';
import { SurveyAction } from '../interfaces/survey-action';
import { MessageService } from './message.service';
import { MessageType } from '../enums/message-type';
import { JumpAction } from '../interfaces/jump-action';
import { CooldownService } from './cooldown.service';
import { RefuelTransaction } from '../interfaces/refuel';
import { Nav } from '../interfaces/nav';
import { SellCargo } from '../interfaces/sell-cargo';
import { Inventory } from '../interfaces/inventory';
import { ScanSystems } from '../interfaces/scan-systems';
import { ScanWaypoints } from '../interfaces/scan-waypoints';

const URL = "https://api.spacetraders.io/v2";

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(
    private http: HttpClient,
    public messageService: MessageService,
    private router: Router,
    private cooldownService: CooldownService) { }

  addToLocalCache(key: string, value: any[]): any[] {
    let cache = this.loadFromLocalCache(key);
    cache.push(...value);
    localStorage.setItem(key, JSON.stringify(cache));
    return cache;
  }

  authenticated(): boolean {
    return this.getAccessCode() !== null
  }

  deleteAccessCode() {
    localStorage.removeItem('accessCode');
  }

  /** misc functions */
  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error("An error occored:", error.error);
      return throwError(() => new Error('Something bad happened.'));
    }
    let message = error.error.error.message
    if (error.status == 401) {
      // something broke with the api token, set a better message
      // and delete the existing access code
      localStorage.removeItem('accessCode');
      message = "Access Code was invalid, please reregister.";
      timer(3500).subscribe(
        _ => this.router.navigate(['/'])
      )
    }

    this.messageService.addMessage(message, MessageType.ERROR);
    return of<never>();
  }

  getAccessCode(): string | null {
    return localStorage.getItem('accessCode');
  }

  getFromLocalCache(key: string): Observable<any[]> {
    let cache = this.loadFromLocalCache(key);
    let newCache = cache;
    let now = DateTime.now();
    for (let survey of cache) {
      let surveyExpiration = DateTime.fromISO(survey.expiration);
      if (now > surveyExpiration) {
        newCache = cache.filter(c => c != survey);
        continue;
      }
    }
    localStorage.setItem(key, JSON.stringify(newCache));
    return of(newCache);
  }

  getOptions(): {headers: HttpHeaders} {
    let accessCode = this.getAccessCode();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });
    if (accessCode) {
      headers = headers.set('Authorization', `Bearer ${accessCode}`);
    }
    return {
      headers: headers
    };
  }

  loadFromLocalCache(key: string): any[] {
    return JSON.parse(localStorage.getItem(key) ?? `[]`) as any[];
  }

  register(callsign: string, faction: string): Observable<Register> {
    return this.http.post<Response<Register>>(
      `${URL}/register`,
      {
        "symbol": callsign,
        "faction": faction
      },
      this.getOptions()
    ).pipe(
      catchError(this.handleError.bind(this)),
      map(register => {
        this.saveAccessCode(register.data.token);
        return register.data
      })
    )
  }

  retry(error: HttpErrorResponse, retryCount: number): ObservableInput<any> {
    if (error.status == 429) {
      // This request was rate-limited, we should
      // delay to the deadline in x-ratelimit-reset
      // (current rate: 2 per second (2023-05-13))
      // do not wait for more than 1000ms, or less than 100ms
      let resetDate = DateTime.fromISO(error.headers.get('x-ratelimit-reset') ?? '');
      let diff = resetDate.diff(DateTime.now(), 'milliseconds').milliseconds;
      return timer(Math.max(Math.min(diff, 1000), 100));
    }
    throw error;
  }

  saveAccessCode(accessCode: string): string {
    localStorage.setItem(
      'accessCode', accessCode
    );
    return accessCode;
  }

  /** Generic API calls */
  /**
   * Generic GET method
   * @param path 
   * @returns 
   */
  get<T>(path: string): Observable<Response<T>> {
    if (!this.authenticated) {
      return of();
    }
    return this.http.get<Response<T>>(
      `${URL}/${path}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError.bind(this)),
      map(response => response)
    );
  }

  /**
   * Generic POST method
   * @param path 
   * @param body 
   * @returns 
   */
  post<T>(path: string, body: any = {}): Observable<Response<T>> {
    if (!this.authenticated) {
      return of();
    }

    let headers = this.getOptions().headers;

    return this.http.post<Response<T>>(
      `${URL}/${path}`,
      body,
      {
        headers: headers,
        responseType: 'json'
      }
    ).pipe(
      catchError(this.handleError.bind(this)),
      map(response => response)
    );
  }

  /** Reusable API calls */

  /**
   * Get Agent
   * @returns 
   */
  getAgent(): Observable<Agent> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Agent>(
      `my/agent`
    ).pipe(
      map(response => response.data)
    )
  }

  /**
   * Get Contract
   * @param id 
   * @returns 
   */
  getContract(id: string): Observable<Contract> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Contract>(
      `my/contracts/${id}`
    ).pipe(
      map(response => response.data)
    )
  }

  /**
   * Get Contracts
   * 
   * @param limit how many per page
   * @param page the page to return
   * @returns 
   */
  getContracts(limit: number = 20, page: number = 1): Observable<Response<Contract[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Contract[]>(
      `my/contracts?limit=${limit}&page=${page}`,
    );
  }

  /**
   * Get Ship
   * @param shipSymbol 
   * @returns 
   */
  getShip(shipSymbol: string): Observable<Ship> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Ship>(
      `my/ships/${shipSymbol}`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get my ships
   * @param limit how many per page
   * @param page which page to get
   * @returns 
   */
  getShips(limit: number = 20, page: number = 1): Observable<Response<Ship[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Ship[]>(
      `my/ships?limit=${limit}&page=${page}`
    );
  }

  /**
   * Get System
   * @param systemSymbol 
   * @returns 
   */
  getSystem(systemSymbol: string): Observable<System> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<System>(
      `systems/${systemSymbol}`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Get Systems
   * @param limit how many per page
   * @param page which page to get
   * @returns 
   */
  getSystems(limit: number = 20, page: number = 1): Observable<Response<System[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<System[]>(
      `systems?limit=${limit}&page=${page}`
    );
  }

  /**
   * Get waypoint
   * @param systemSymbol 
   * @param waypointSymbol 
   * @returns 
   */
  getWaypoint(systemSymbol: string, waypointSymbol: string): Observable<Waypoint> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Waypoint>(
      `systems/${systemSymbol}/waypoints/${waypointSymbol}`
    ).pipe(
      map(response => response.data)
    )
  }

  /**
   * Get waypoints in system
   * @param systemSymbol 
   * @param limit 
   * @param page 
   * @returns 
   */
  getWaypoints(systemSymbol: string, limit: number = 20, page: number = 1): Observable<Response<Waypoint[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.get<Waypoint[]>(
      `systems/${systemSymbol}/waypoints?limit=${limit}&page=${page}`
    );
  }

  /** Ship Actions */
  // TODO split these out in their own service?

  /**
   * Perform a Dock action
   * @param ship 
   * @returns
   */
  postDock(ship: Ship): Observable<Nav> {
    return this.post<Nav>(
      `my/ships/${ship.symbol}/dock`,
      {}
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Perform a Jump action
   * 
   * Adds cooldown to the cooldown service
   * @param ship 
   * @param systemSymbol 
   * @returns
   */
  postJump(ship: Ship, systemSymbol: string): Observable<JumpAction> {
    return this.post<JumpAction>(
      `my/ships/${ship.symbol}/jump`,
      {
        systemSymbol: systemSymbol
      }
    ).pipe(
      map(response => {
        this.cooldownService.addCooldown(ship, response.data.cooldown);
        return response.data
      })
    )
  }

  /**
   * Perform an orbit action
   * @param ship 
   * @returns 
   */
  postOrbit(ship: Ship): Observable<Nav> {
    return this.post<Nav>(
      `my/ships/${ship.symbol}/orbit`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Perform a Refuel action
   * @param ship 
   * @returns 
   */
  postRefuel(ship: Ship): Observable<RefuelTransaction> {
    return this.post<RefuelTransaction>(
      `/my/ships/${ship.symbol}/refuel`
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * Perform a Scan Systems action
   * @param ship 
   * @returns 
   */
  postScanSystems(ship: Ship): Observable<ScanSystems> {
    return this.post<ScanSystems>(
      `my/ships/${ship.symbol}/scan/systems`
    ).pipe(
      map(response => {
        this.cooldownService.addCooldown(ship, response.data.cooldown);
        return response.data;
      })
    );
  }

  postScanWaypoints(ship: Ship): Observable<ScanWaypoints> {
    return this.post<ScanWaypoints>(
      `my/ships/${ship.symbol}/scan/waypoints`
    ).pipe(
      map(response => {
        this.cooldownService.addCooldown(ship, response.data.cooldown);
        return response.data;
      })
    );
  }

  /**
   * Perform a Sell action from ship cargo
   * @param ship 
   * @param inventory 
   * @param units 
   * @returns 
   */
  postSellCargo(ship: Ship, inventory: Inventory, units: number): Observable<SellCargo> {
    return this.post<SellCargo>(
      `my/ships/${ship.symbol}/sell`,
      {
        'symbol': inventory.symbol,
        'units': units
      }
    ).pipe(
      map(response => response.data)
    );
  }

  /**
   * 
   * Perform the survey action on a ship; caching the results
   * 
   * Before doing the survey, check the cache for a result, return that
   * unless the timeout has passed, then remove the cached survey and POST
   *
   * Adds cooldown to the cooldown service
   * @param ship 
   * @returns 
   */
  postSurvey(ship: Ship): Observable<Survey[]> {
    // check the chache first
    let cacheHit: Survey[] = [];
    this.getFromLocalCache('surveys').pipe(
      map((surveys: Survey[]) => surveys.filter(s => s.symbol == ship.nav.waypointSymbol)),
      take(1)
    ).subscribe(
      surveys => cacheHit = surveys
    )

    if (cacheHit.length > 0) {
      return of(cacheHit);
    }

    if (!this.authenticated()) {
      return of();
    }
    return this.post<SurveyAction>(
      `my/ships/${ship.symbol}/survey`
    ).pipe(
      map(response => {
        this.addToLocalCache('surveys', response.data.surveys);
        this.cooldownService.addCooldown(ship, response.data.cooldown);
        return response.data.surveys
      })
    );
  }
}
