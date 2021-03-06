import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {

  _url = 'http://localhost:9000/api'

  constructor(private http: HttpClient) {
    console.log("servicio ahorro activo")
   }

   getAhorro(): Observable<any>{
        return this.http.get(this._url).pipe(
          catchError(this.handleError)
        )
    }

    postAhorro(ahorro: any): Observable<any>{
      return this.http.post(this._url, ahorro, {responseType: 'text'})
    }
    
    deleteAhorro(id: number): Observable<any>{
        return this.http.delete(this._url + '/' + id, {responseType: 'text'})
    }

    putAhorro(ahorro: any): Observable<any>{
      return this.http.put(this._url + '/' + ahorro.id, ahorro)
    }

    handleError(error: Response): any{
          console.log(error);
    }
}
