import { HttpClientModule } from "@angular/common/http";
import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
    selector: 'app-header',
    standalone: true,
    template: `<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="javascript:void(0)">Logo</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="mynavbar">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <a class="nav-link" routerLink="home">Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" routerLink="login">Login</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" [routerLink]="['/register']">Sign Up</a>
          </li>
        </ul>
        <form class="d-flex">
          <input class="form-control me-2" type="text" placeholder="Search">
          <button class="btn" type="button">Search</button>
        </form>
      </div>
    </div>
  </nav>`,
    imports: [RouterLink ,HttpClientModule]
})
export class Header { }