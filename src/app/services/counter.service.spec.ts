import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, vi, expect, it } from 'vitest';
import { CounterService } from './counter.service';
import { Preferences } from '@capacitor/preferences';
import { SavedCounter } from '../models/saved-counter';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));


describe('CounterService', () => {
  let service: CounterService;
  
  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 1,
      createdAt: new Date().toISOString()
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 2,
      createdAt: new Date().toISOString()
    };

  beforeEach(() => {
    vi.clearAllMocks();

    getMock.mockResolvedValue({ value: null });

    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [CounterService],
  });
    service = TestBed.inject(CounterService);
  });

  it('should initialize only once', async () => {
    // Dvě volání bez čekání simulují souběžné požadavky na inicializaci.
    await Promise.all([service.initialize(), service.initialize()]);

    // Další volání proběhne až po dokončení první inicializace.
    await service.initialize();

    // Všechna volání musí sdílet jedinou operaci načtení Preferences.
    expect(getMock).toHaveBeenCalledTimes(1);

    // Služba dokončila inicializaci a při value: null má prázdnou historii.
    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
});
//TODO: doplnění testovacích případů
//1.) Načtení uložených dat – JSON obsahující pole SavedCounter se po initialize() objeví v counters().
//2.) Přidání záznamu – add() vloží nový záznam na začátek a zavolá Preferences.set() se správným klíčem a JSON hodnotou.
//3.) Odstranění jednoho záznamu – remove(id) odstraní pouze odpovídající objekt a nový stav uloží.
//4.) Vymazání historie – clear() vyprázdní signal a zavolá Preferences.remove() pouze pro klíč saved-counters.
//5.) Poškozená uložená hodnota – neplatný JSON nezpůsobí pád testu; služba nastaví prázdnou historii, dokončí inicializaci a zapíše chybu do konzole.
});