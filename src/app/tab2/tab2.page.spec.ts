import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Preferences } from '@capacitor/preferences';
import { SavedCounter } from '../models/saved-counter';
import { Tab2Page } from './tab2.page';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
  },
}));

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  const getMock = vi.mocked(Preferences.get);
  const setMock = vi.mocked(Preferences.set);
  const removeMock = vi.mocked(Preferences.remove);

  beforeEach(async () => {
    vi.clearAllMocks();
    getMock.mockResolvedValue({ value: null });
    setMock.mockResolvedValue(undefined);
    removeMock.mockResolvedValue(undefined);

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should checkovat jestli minimální a maximální hodnoty fungují', async () => {
    const first: SavedCounter = {
      id: 'first',
      name: 'První',
      value: 8,
      createdAt: new Date().toISOString(),
    };
    const second: SavedCounter = {
      id: 'second',
      name: 'Druhé',
      value: 3,
      createdAt: new Date().toISOString(),
    };

    await component.counterService.add(first);
    await component.counterService.add(second);
    fixture.detectChanges();

    expect(component.minimumValue()).toBe(3);
    expect(component.maximumValue()).toBe(8);
    expect(fixture.nativeElement.textContent).toContain('Minimální hodnota: 3');
    expect(fixture.nativeElement.textContent).toContain('Maximální hodnota: 8');

    await component.counterService.remove(second.id);
    fixture.detectChanges();

    expect(component.minimumValue()).toBe(8);
    expect(component.maximumValue()).toBe(8);
    expect(fixture.nativeElement.textContent).toContain('Minimální hodnota: 8');
    expect(fixture.nativeElement.textContent).toContain('Maximální hodnota: 8');

    await component.clear();
    fixture.detectChanges();

    expect(component.minimumValue()).toBeNull();
    expect(component.maximumValue()).toBeNull();
  });
});
