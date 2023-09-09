import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';

import Header from '../Header.jsx';
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteEvent, fetchEvent, queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';

export default function EventDetails() {

  const params = useParams();
const navigate = useNavigate();

  const {data, isPending, isError, error} = useQuery({
    queryKey: ["events",params.id],
    queryFn: ({signal})=>fetchEvent({signal,id:  params.id}),
  
  })

 const {mutate} = useMutation({
  onSuccess: ()=>{
    queryClient.invalidateQueries({queryKey: ['events'],refetchType: 'none'}); // will invalidate all queries that include this key
    
    navigate('/events')
  },
    mutationFn: deleteEvent
  })

  function handleDelete(){
    mutate({id: params.id});
  }

  let content;
  
  

  if(isPending){
    content =  (<LoadingIndicator />)
  }

  if(data){
    content = (
      <>
      <header>
          <h1>{data.title}</h1>
          <nav>
            <button onClick={handleDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
      <div id="event-details-content">
      <img src={"http://localhost:3000/"+data.image} alt="" />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{data.time}</time>
        </div>
        <p id="event-details-description">{data.description}</p>
      </div>
    </div>
    </>
    )
  }

  if(isError){
    content = <h1>{error.info?.message}</h1>
  }



  return (
    <>
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        
       {content}
      </article>
    </>
  );
}
