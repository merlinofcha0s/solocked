import { Subscription } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AccountsService } from './../../shared/account/accounts.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Account } from '../../shared/account/account.model';

@Component({
  selector: 'jhi-accountsdb-details',
  templateUrl: './accountsdb-details.component.html',
  styles: []
})
export class AccountsdbDetailsComponent implements OnInit, OnDestroy {

  private routeObservable: Subscription;
  account$: BehaviorSubject<Account>;
  private id: number;

  constructor(private route: ActivatedRoute, private router: Router,
    private accountsService: AccountsService) { }

  ngOnInit() {
    this.routeObservable = this.route.params.subscribe((params) => {
      this.id = +params['id'];
      this.initAccountDetail(this.id);
    });
  }

  ngOnDestroy(): void {
    this.routeObservable.unsubscribe();
  }

  initAccountDetail(id: number) {
    this.account$ = this.accountsService.account$;
    this.accountsService.getAccount(id);
  }

  onDelete(id: number) {
    this.accountsService.deleteAccount(id);
    this.router.navigate(['/accounts']);
  }

}
