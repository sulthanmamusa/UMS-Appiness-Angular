import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService, AuthenticationService } from '@app/_services';

@Component({templateUrl: 'edit.component.html'})
export class EditComponent implements OnInit {
    editForm: FormGroup;
    userRole = 'User';
    loading = false;
    submitted = false;
	id = this.route.snapshot.paramMap.get('id');
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.editForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
			username: ['', Validators.compose([
				Validators.required,
				Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
			])],
            password: ['', [Validators.required, Validators.minLength(6)]],
            roles: ['User', [Validators.required]],
            url: ['', [Validators.pattern(/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/)]],
            comments: ['', [Validators.required]],
            adhaar: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]]
        });
		this.userService.getById(this.id).pipe().subscribe(user => {
            //this.user = user;
            this.userRole = user.roles.includes('Admin') ? 'Admin' : 'User';
			this.editForm.patchValue({
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				password: user.password,
				roles: this.userRole,
				comments: user.comments,
				adhaar: user.adhaar,
				url: user.url
			});
        });
    }
	
	get isAdmin() {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		console.log(currentUser);
        return currentUser.roles[0] === 'Admin';
    }

    get f() { return this.editForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.editForm.invalid) {
            return;
        }

        this.loading = true;
		const userData = this.editForm.value;
		userData._id = this.id;
        this.userService.update(userData)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Updated successful', true);
                    this.router.navigate(['/']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
}
