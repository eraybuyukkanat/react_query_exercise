import { Link, redirect, useNavigate, useParams, useSubmit } from "react-router-dom";

import Modal from "../UI/Modal.jsx";
import EventForm from "./EventForm.jsx";
import LoadingIndicator from "../UI/LoadingIndicator.jsx";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchEvent, queryClient, updateEvent } from "../../util/http.js";
import ErrorBlock from "../UI/ErrorBlock.jsx";

export default function EditEvent() {

  const submit =useSubmit();

  const navigate = useNavigate();

  const params = useParams();

  const { data} = useQuery({
    queryKey: ["events", params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
  });

 const { mutate } = useMutation({
  onSuccess: ()=>{
    queryClient.invalidateQueries({queryKey: ['events']}); // will invalidate all queries that include this key
    navigate('/events')
  },
    mutationFn: updateEvent 
  })

  function handleSubmit(formData) {
   submit(formData,{method: "PUT"});
  }

  function handleClose() {
    navigate("../");
  }



  return <Modal onClose={handleClose}>
    <EventForm inputData={data} onSubmit={handleSubmit}>
      <Link to="../" className="button-text">
        Cancel
      </Link>
      <button type="submit" className="button">
        Update
      </button>
    </EventForm>;
  </Modal>;
}

export function loader({params}){
  return queryClient.fetchQuery({
    queryKey: ["events",params.id],
    queryFn: ({signal})=>fetchEvent({signal,id: params.id})
  })
}

export async function action({request,params}){
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData)
  await updateEvent({id: params.id,event: updatedEventData})
  queryClient.invalidateQueries(['events'])
  return redirect('../');
}