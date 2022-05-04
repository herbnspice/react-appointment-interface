import SearchAppointments from './components/Search'
import AddAppointments from './components/AddAppointments'
import AppointmentInfo from './components/AppointmentInfo'
import { useCallback, useEffect, useState } from 'react'

function App(){
    let [appointmentList, setAppointmentList ] = useState([])
    let [query, setQuery ] =  useState('')
    let [sortBy, setSortBy ] = useState("ownerName")
    let [orderBy, setOrderBy ] = useState('asc')
    const filteredAppointments = appointmentList.filter( 
        item => {
            return (
                item.petName.toLowerCase().includes(query.toLowerCase()) ||
                item.ownerName.toLowerCase().includes(query.toLowerCase()) ||
                item.aptNotes.toLowerCase().includes(query.toLowerCase()) 
        )}
    ).sort((a,b) => {
        let order = (orderBy === 'asc') ? 1 : -1 
        return( a[sortBy].toLowerCase() < b[sortBy].toLowerCase() 
            ? -1 * order : 1 * order
        )
    })

    const fetchData = useCallback(() => {
        fetch('./data.json')
        .then( response => response.json() )
        .then( data => {
            setAppointmentList(data)
        });
    }, [])

    useEffect(()=>{
        fetchData()
    }, [fetchData])
    
    return(
        <main className="page bg-white" id="petratings">
        <div className="container mx-auto">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments 
                    onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment ])}
                    lastId={ appointmentList.reduce((max, item ) => Number(item.id) > max ? Number(item.id) : max, 0 )}
                />
                <SearchAppointments
                    query={query} 
                    onQueryChange={myQeuery=> setQuery(myQeuery)}
                    onSetSort={ order => setSortBy(order) }
                    onSetOrderBy={ order => setOrderBy(order) }
                    sortBy={sortBy}
                    orderBy={orderBy}
                />
                { filteredAppointments.map( appointment => (
                    <AppointmentInfo appointment={appointment} key={appointment.id}
                        onDeleteAppointment={ appointmentId => setAppointmentList( appointmentList.filter( appointment => appointment.id !== appointmentId ))}
                    />
                )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
}

export default App