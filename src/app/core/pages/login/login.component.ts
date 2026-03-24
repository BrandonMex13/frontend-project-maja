import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    private readonly fb = inject(FormBuilder);
    private readonly auth = inject(AuthService);
    private readonly router = inject(Router);

    readonly cargando = signal(false);
    readonly errorMensaje = signal<string | null>(null);

    readonly formulario = this.fb.nonNullable.group({
        correo: ['admin@admin.com', [Validators.required, Validators.email]],
        contrasena: ['12345', Validators.required],
    });

    enviar(): void {
        this.errorMensaje.set(null);
        const { correo, contrasena } = this.formulario.getRawValue();

        if (this.formulario.invalid) {
            this.formulario.markAllAsTouched();
            return;
        }
        
        this.cargando.set(true);
        this.auth.iniciarSesion(correo, contrasena).subscribe({
            next: (result) => {
                localStorage.setItem("usuario", result.user.name)
                this.cargando.set(false);
                void this.router.navigate(['/home/todo-list']);
            },
            error: (err: HttpErrorResponse) => {
                this.cargando.set(false);
                const raw = err.error?.message ?? err.message;
                const msg = Array.isArray(raw) ? raw.join(', ') : raw;
                this.errorMensaje.set(
                    msg ?? 'No pudimos iniciar sesión. Revisa correo y contraseña.',
                );
            },
        });
    }
}
