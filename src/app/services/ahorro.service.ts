import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Ahorro } from 'src/calculadoraDeAhorro.model';

@Injectable({
  providedIn: 'root'
})
export class AhorroService {
  private readonly storageKey = 'ahorros';

  getAhorros(): Observable<Ahorro[]> {
    return of(this.read());
  }

  saveAhorros(ahorros: Ahorro[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ahorros));
  }

  private read(): Ahorro[] {
    let rawAhorros: Partial<Ahorro>[] = [];

    try {
      rawAhorros = JSON.parse(localStorage.getItem(this.storageKey) || '[]') as Partial<Ahorro>[];
    } catch {
      this.saveAhorros([]);
    }

    return rawAhorros
      .filter((item) => Number(item.ingreso) > 0 && !!item.mes && !!item.referencia)
      .map((item, index) => new Ahorro(
        Number(item.ingreso),
        String(item.mes),
        String(item.referencia),
        Number(item.id) || Date.now() + index
      ));
  }
}
