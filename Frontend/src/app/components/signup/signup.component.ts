import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service'
import { Router } from '@angular/router'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '../../custom-validators';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  form: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  createForm() {
    this.form = new FormGroup({
      userName: new FormControl("", Validators.required),
      password: new FormControl("", Validators.compose([
        Validators.required,
        Validators.minLength(8),
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        CustomValidators.patternValidator(/[A-Z]/, {
          hasCapitalCase: true
        }),
        CustomValidators.patternValidator(/[a-z]/, {
          hasSmallCase: true
        }),
        CustomValidators.patternValidator(
          /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
          {
            hasSpecialCharacters: true
          }
        )
      ])),
      name: new FormControl("", Validators.required),
      apellidoPaterno: new FormControl("", Validators.required),
      apellidoMaterno: new FormControl("", Validators.required),
      phoneNum: new FormControl("", [
        Validators.required,
        Validators.minLength(10)]
      ),
      addressCalle: new FormControl("", Validators.required),
      addressColonia: new FormControl("", Validators.required),
      codPostal: new FormControl("", [Validators.required, Validators.minLength(5)])
    })
  }
  ngOnInit() {
    this.createForm();
  }

  signUp() {
    let user = this.form.value;
    console.log(user)
    this.authService.signUpUser(user)
      .subscribe(
        res => {
          console.log(res);
          localStorage.setItem('token', res.token);
          this.router.navigate(['/home']);
        },
        err => {
          console.log(err)
          alert("El usuario ya se encuentra en uso!")
        }
      )
  }

}
