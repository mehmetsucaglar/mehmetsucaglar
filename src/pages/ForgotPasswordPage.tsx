import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import FormField from "../components/forms/FormField";
import { validateForgotPassword } from "../utils/validators";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateForgotPassword(email);
    setError(found);
    setSent(found === undefined);
  }

  return (
    <>
      <p>Kayıtlı e-posta adresinizi yazın, şifre yenileme bağlantısı gönderelim.</p>
      {sent && (
        <p className="mesaj mesaj-basari" role="status">
          Bağlantı {email.trim()} adresine gönderildi (demo).
        </p>
      )}
      <form className="form" noValidate onSubmit={handleSubmit}>
        <FormField id="email" label="E-posta" error={error}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={error ? true : undefined} />
        </FormField>
        <p className="form-butonlar">
          <button type="submit" className="buton">Bağlantı gönder</button>
        </p>
      </form>
      <p className="form-baglantilar">
        <Link to="/login">← Girişe dön</Link>
      </p>
    </>
  );
}
