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

  it('should fungovat pls', async () => {
    await Promise.all([service.initialize(), service.initialize()]);

    await service.initialize();

    expect(getMock).toHaveBeenCalledTimes(1);

    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
});

  it('meli by se nacist ulozene pocitadla', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });

    await service.initialize();

    expect(service.counters()).toEqual([first, second]);
  });

  it('funguje pridavani zaznamu', async () => {
    await service.initialize();

    await service.add(first);

    expect(service.counters()).toEqual([first]);
    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([first]),
    });
  });

  it('funguje odebirani jednoho zaznamu', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });
    await service.initialize();

    await service.remove(first.id);

    expect(service.counters()).toEqual([second]);
    expect(setMock).toHaveBeenCalledWith({
      key: 'saved-counters',
      value: JSON.stringify([second]),
    });
  });

  it('funguje mazani historie a vola Pref.remove() jenom na pocitadlo', async () => {
    getMock.mockResolvedValue({ value: JSON.stringify([first, second]) });
    await service.initialize();

    await service.clear();

    expect(service.counters()).toEqual([]);
    expect(removeMock).toHaveBeenCalledTimes(1);
    expect(removeMock).toHaveBeenCalledWith({ key: 'saved-counters' });
  });

  it('funguje zpracovani neplatneho JSONu a logovani chyby', async () => {
    getMock.mockResolvedValue({ value: '{rozbity json :)' });
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(service.initialize()).resolves.toBeUndefined();

    expect(service.initialized()).toBe(true);
    expect(service.counters()).toEqual([]);
    expect(errorSpy).toHaveBeenCalledWith('Historii počítadel se nepodařilo načíst.', expect.any(Error));
    errorSpy.mockRestore();
  });
});