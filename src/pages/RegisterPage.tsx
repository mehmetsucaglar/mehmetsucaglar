import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/forms/FormField";
import { validateRegister, type RegisterErrors } from "../utils/validators";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [valid, setValid] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateRegister(name, email, password, password2);
    setErrors(found);
    setValid(Object.keys(found).length === 0);
  }

  return (
    <>
      {valid && (
        <p className="mesaj mesaj-basari" role="status">
          Form geçerli. Gerçek kayıt sonraki sprintlerde eklenecek.
        </p>
      )}
      <form className="form" noValidate onSubmit={handleSubmit}>
        <FormField id="name" label="Ad Soyad" error={errors.name}>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={errors.name ? true : undefined} />
        </FormField>
        <FormField id="email" label="E-posta" error={errors.email}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={errors.email ? true : undefined} />
        </FormField>
        <FormField id="password" label="Şifre" error={errors.password}>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} aria-invalid={errors.password ? true : undefined} />
        </FormField>
        <FormField id="password2" label="Şifre (tekrar)" error={errors.password2}>
          <input id="password2" type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} aria-invalid={errors.password2 ? true : undefined} />
        </FormField>
        <p className="form-butonlar">
          <button type="submit" className="buton">Kayıt ol</button>
        </p>
      </form>
      <p className="form-baglantilar">
        <Link to="/login">Zaten hesabın var mı? Giriş yap</Link>
      </p>
    </>
  );
}
