import type { EventFormData, EventFormErrors } from "../types/campus-event";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function emailError(email: string): string | undefined {
  return EMAIL_RE.test(email.trim()) ? undefined : "Geçerli bir e-posta girin.";
}

function passwordError(password: string): string | undefined {
  return password.length < 6 ? "Şifre en az 6 karakter olmalı." : undefined;
}

export function validateEvent(data: EventFormData): EventFormErrors {
  const errors: EventFormErrors = {};

  if (data.title.trim().length < 3) errors.title = "Etkinlik adı en az 3 karakter olmalı.";
  if (data.category === "") errors.category = "Bir kategori seçin.";
  if (data.date === "") errors.date = "Tarih seçin.";
  if (data.time === "") errors.time = "Saat seçin.";
  if (data.location.trim() === "") errors.location = "Yer boş olamaz.";

  const capacity = Number(data.capacity);
  if (data.capacity.trim() === "" || !Number.isInteger(capacity) || capacity < 1 || capacity > 1000) {
    errors.capacity = "Kontenjan 1 ile 1000 arasında bir tam sayı olmalı.";
  }

  if (data.description.trim().length < 10) errors.description = "Açıklama en az 10 karakter olmalı.";

  return errors;
}

export interface LoginErrors {
  email?: string;
  password?: string;
}

export function validateLogin(email: string, password: string): LoginErrors {
  const errors: LoginErrors = {};
  const e = emailError(email);
  const p = passwordError(password);
  if (e) errors.email = e;
  if (p) errors.password = p;
  return errors;
}

export interface RegisterErrors extends LoginErrors {
  name?: string;
  password2?: string;
}

export function validateRegister(
  name: string,
  email: string,
  password: string,
  password2: string,
): RegisterErrors {
  const errors: RegisterErrors = validateLogin(email, password);
  if (name.trim().length < 3) errors.name = "Ad soyad en az 3 karakter olmalı.";
  if (password2 !== password) errors.password2 = "Şifreler aynı değil.";
  return errors;
}

export function validateForgotPassword(email: string): string | undefined {
  return emailError(email);
}
