import { Component, computed, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  readonly minimumValue = computed(() => {
    const counters = this.counterService.counters();
    return counters.length > 0
      ? counters.reduce(
          (minimum, counter) => Math.min(minimum, counter.value),
          counters[0].value,
        )
      : null;
  });
  readonly maximumValue = computed(() => {
    const counters = this.counterService.counters();
    return counters.length > 0
      ? counters.reduce(
          (maximum, counter) => Math.max(maximum, counter.value),
          counters[0].value,
        )
      : null;
  });

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
  }

  async clear(): Promise<void> {
    await this.counterService.clear();
  }
}