import { Component } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
    account = {
        name: 'John Doe',
        username: 'JohnDoe',
        email: 'john.doe@example.com',
        password: 'blublublu (ceva ceva criptat)'
      };
}
