import { useNavigate } from "react-router-dom";
import EventForm from "../components/forms/EventForm";
import { useEvents } from "../context/use-events";
import type { EventFormData } from "../types/campus-event";

const emptyForm: EventFormData = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  capacity: "",
  description: "",
};

export default function AdminNewPage() {
  const { addEvent } = useEvents();
  const navigate = useNavigate();

  return (
    <EventForm
      initialData={emptyForm}
      submitText="Kaydet"
      onSubmit={(data) => {
        addEvent(data);
        navigate("/admin");
      }}
    />
  );
}
