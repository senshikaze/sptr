import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
import { Ship } from './interfaces/ship';
import { Agent } from './interfaces/agent';
import { Response } from './interfaces/response';
import { Waypoint } from './interfaces/waypoint';
import { System } from './interfaces/system';
import { Register } from './interfaces/register';

const URL = "https://api.spacetraders.io/v2";

@Injectable({
  providedIn: 'root'
})


export class ApiService {

  constructor(private http: HttpClient) { }

  authenticated(): boolean {
    return this.getAccessCode() !== null
  }

  /** misc functions */
  handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error("An error occorused:", error.error);
    } else {
      console.error(
        `API server returned code ${error.status}, body was`, error.error
      );
    }
    return throwError(() => new Error('Something bad happened.'));
  }

  getAccessCode(): string | null {
    return localStorage.getItem('accessCode');
  }

  getOptions(): Object {
    let accessCode = this.getAccessCode();
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
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

  saveAccessCode(accessCode: string): string {
    localStorage.setItem(
      'accessCode', accessCode
    );
    return accessCode;
  }

  /** API calls */

  /** Get Agent */
  getAgent(): Observable<Agent> {
    return this.http.get<Response<Agent>>(
      `${URL}/my/agent`,
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
      map(response => response.data)
    )
  }

  /** Get A Ship */
  getShip(shipSymbol: string): Observable<Ship> {
    return this.http.get<Response<Ship>>(
      `${URL}/my/ships/${shipSymbol}`,
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
      map(response => response.data)
    );
  }
  /** Get My ships */
  getShips(): Observable<Ship[]> {
    return this.http.get<Response<Ship[]>>(
      `${URL}/my/ships`,
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
      map(response => response.data)
    );
  }

  /** Get System */
  getSystem(systemSymbol: string): Observable<System> {
    return this.http.get<Response<System>>(
      `${URL}/systems/${systemSymbol}`,
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
      map(response => response.data)
    );
  }

  /** Get Waypoint */
  getWaypoint(systemSymbol: string, waypointSymbol: string): Observable<Waypoint> {
    return this.http.get<Response<Waypoint>>(
      `${URL}/systems/${systemSymbol}/waypoints/${waypointSymbol}`,
      this.getOptions()
    ).pipe(
      catchError(this.handleError),
      map(response => response.data)
    )
  }
}
