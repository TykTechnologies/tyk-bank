import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { UserService, User } from '../user.service';
import { NotificationService } from '../../../core/core.module';
import { ROUTE_ANIMATIONS_ELEMENTS } from '../../../core/core.module';

const initialUserState: User = {
  name: '',
  address: {
    city: '',
    postalCode: '',
    country: '',
    street: ''
  }
};

@Component({
  selector: 'tyk-bank-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UserProfileComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  user = initialUserState;
  userId = '';

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUserData().subscribe(res => {
      this.userId = res.id;
      if (res.name) {
        this.user.name = res.name;
      }
      if (res.address) {
        this.user.address.street = res.address.street;
        this.user.address.city = res.address.city;
        this.user.address.postalCode = res.address.postalCode;
        this.user.address.country = res.address.country;
      }
    });
  }

  updateUser() {
    this.userService
      .updateUser(this.userId, this.user.name, this.user.address)
      .subscribe(res => {
        this.notificationService.success('user updated');
      });
  }
}
