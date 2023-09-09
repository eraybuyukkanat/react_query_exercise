import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { createNewEvent } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { queryClient } from '../../util/http.js';
export default function NewEvent() {
  const navigate = useNavigate();


 const { mutate, isPending, isError,error } = useMutation({
  onSuccess: ()=>{
    queryClient.invalidateQueries({queryKey: ['events']}); // will invalidate all queries that include this key
    navigate('/events')
  },
  mutationFn: createNewEvent
 });

 function handleSubmit(formData){
    mutate({event: formData});
 }
 return (
    <Modal onClose={() => navigate('../')}>
      <EventForm onSubmit={handleSubmit}>
        {isPending && "Submitting..."}
        {!isPending && (
        <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Create
          </button>
        </>)}
      </EventForm>
      {isError && <ErrorBlock title="Something Wrong!" message={error.info?.message || "Failed"}/>}
    </Modal>
  );
}
