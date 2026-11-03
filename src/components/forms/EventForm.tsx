import { useState, type ChangeEvent, type FormEvent } from "react";
import type { Category, EventFormData, EventFormErrors } from "../../types/campus-event";
import { validateEvent } from "../../utils/validators";
import FormField from "./FormField";

interface EventFormProps {
  initialData: EventFormData;
  submitText: string;
  onSubmit: (data: EventFormData) => void;
}

const categories: Category[] = ["Seminer", "Atölye", "Söyleşi", "Yarışma"];

export default function EventForm({ initialData, submitText, onSubmit }: EventFormProps) {
  const [values, setValues] = useState<EventFormData>(initialData);
  const [errors, setErrors] = useState<EventFormErrors>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length === 0) onSubmit(values);
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      <FormField id="title" label="Etkinlik Adı" error={errors.title}>
        <input id="title" name="title" type="text" value={values.title} onChange={handleChange} aria-invalid={errors.title ? true : undefined} />
      </FormField>

      <FormField id="category" label="Kategori" error={errors.category}>
        <select id="category" name="category" value={values.category} onChange={handleChange} aria-invalid={errors.category ? true : undefined}>
          <option value="">Seçiniz</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </FormField>

      <FormField id="date" label="Tarih" error={errors.date}>
        <input id="date" name="date" type="date" value={values.date} onChange={handleChange} aria-invalid={errors.date ? true : undefined} />
      </FormField>

      <FormField id="time" label="Saat" error={errors.time}>
        <input id="time" name="time" type="time" value={values.time} onChange={handleChange} aria-invalid={errors.time ? true : undefined} />
      </FormField>

      <FormField id="location" label="Yer" error={errors.location}>
        <input id="location" name="location" type="text" value={values.location} onChange={handleChange} aria-invalid={errors.location ? true : undefined} />
      </FormField>

      <FormField id="capacity" label="Kontenjan" error={errors.capacity}>
        <input id="capacity" name="capacity" type="number" value={values.capacity} onChange={handleChange} aria-invalid={errors.capacity ? true : undefined} />
      </FormField>

      <FormField id="description" label="Açıklama" error={errors.description}>
        <textarea id="description" name="description" rows={5} value={values.description} onChange={handleChange} aria-invalid={errors.description ? true : undefined} />
      </FormField>

      <p className="form-butonlar">
        <button type="submit" className="buton">{submitText}</button>
      </p>
    </form>
  );
}
