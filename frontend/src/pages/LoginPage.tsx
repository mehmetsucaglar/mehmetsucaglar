import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/forms/FormField";
import { validateLogin, type LoginErrors } from "../utils/validators";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [valid, setValid] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateLogin(email, password);
    setErrors(found);
    setValid(Object.keys(found).length === 0);
  }

  return (
    <>
      {valid && (
        <p className="mesaj mesaj-basari" role="status">
          Form geçerli. Gerçek giriş sonraki sprintlerde eklenecek.
        </p>
      )}
      <form className="form" noValidate onSubmit={handleSubmit}>
        <FormField id="email" label="E-posta" error={errors.email}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? true : undefined} />
        </FormField>
        <FormField id="password" label="Şifre" error={errors.password}>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={errors.password ? true : undefined} />
        </FormField>
        <p className="form-butonlar">
          <button type="submit" className="buton">Giriş yap</button>
        </p>
      </form>
      <p className="form-baglantilar">
        <Link to="/forgot-password">Şifremi unuttum</Link>
        <Link to="/register">Hesabın yok mu? Kayıt ol</Link>
      </p>
    </>
  );
}
