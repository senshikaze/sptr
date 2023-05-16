import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, ObservableInput, of, throwError, timer } from 'rxjs';
import { catchError, map, retry} from 'rxjs/operators';
import { Ship } from './interfaces/ship';
import { Agent } from './interfaces/agent';
import { Response } from './interfaces/response';
import { Waypoint } from './interfaces/waypoint';
import { System } from './interfaces/system';
import { Register } from './interfaces/register';
import { Contract } from './interfaces/contract';
import { DateTime } from 'luxon';
import { ErrorService } from './error.service';
import { ApiError } from './interfaces/apierror';

const URL = "https://api.spacetraders.io/v2";

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http: HttpClient, private errorService: ErrorService) { }

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
    } else {
      let message = error.error.error.message
      if (error.status == 401 && error.error.error.code == 4104) {
        // something broke with the api token, set a better message
        // and delete the existing access code
        localStorage.removeItem('accessCode');
        message = "Access Code was invalid, please reregister.";
      }

      this.errorService.setError(true, message);
    }
    return throwError(() => new Error('Something bad happened.'));
  }

  getAccessCode(): string | null {
    return localStorage.getItem('accessCode');
  }

  getOptions(): Object {
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

  register(callsign: string, faction: string): Observable<Register> {
    return this.http.post<Response<Register>>(
      `${URL}/register`,
      {
        "symbol": callsign,
        "faction": faction
      },
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
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

  /** API calls */

  /** Get Agent */
  getAgent(): Observable<Agent> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Agent>>(
      `${URL}/my/agent`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    )
  }

  /** Get Contract */
  getContract(id: string): Observable<Contract> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Contract>>(
      `${URL}/my/contracts/${id}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    )
  }

  /** Get Contracts */
  getContracts(filter: string| null = null, limit: number = 20, page: number = 1): Observable<Contract[]> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Contract[]>>(
      `${URL}/my/contracts?limit=${limit}&page=${page}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => {
        if (filter == "accepted") {
          return response.data.filter(c => c.accepted);
        }
        return response.data;
      })
    )
  }

  /** Get A Ship */
  getShip(shipSymbol: string): Observable<Ship> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Ship>>(
      `${URL}/my/ships/${shipSymbol}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    );
  }
  /** Get My ships */
  getShips(limit: number = 20, page: number = 1): Observable<Ship[]> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Ship[]>>(
      `${URL}/my/ships?limit=${limit}&page=${page}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    );
  }

  /** Get System */
  getSystem(systemSymbol: string): Observable<System> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<System>>(
      `${URL}/systems/${systemSymbol}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    );
  }

  getSystems(limit: number = 20, page: number = 1): Observable<Response<System[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<System[]>>(
      `${URL}/systems?limit=${limit}&page=${page}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response)
    );
  }

  /** Get Waypoint */
  getWaypoint(systemSymbol: string, waypointSymbol: string): Observable<Waypoint> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Waypoint>>(
      `${URL}/systems/${systemSymbol}/waypoints/${waypointSymbol}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response.data)
    )
  }

  getWaypoints(systemSymbol: string, limit: number = 20, page: number = 1): Observable<Response<Waypoint[]>> {
    if (!this.authenticated()) {
      return of();
    }
    return this.http.get<Response<Waypoint[]>>(
      `${URL}/systems/${systemSymbol}/waypoints?limit=${limit}&page=${page}`,
      this.getOptions()
    ).pipe(
      retry({count: 3, delay: this.retry}),
      catchError(this.handleError),
      map(response => response)
    );
  }
}
