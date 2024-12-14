'use client';

import React, { useState, useEffect } from 'react';
import { events } from '../../../Data';
import { useRouter } from 'next/navigation';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
//import { Textarea } from '../components/ui/textarea';
import { useToast } from '../../../hooks/use-toast';


const AdminEventDetails = () => {
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/adminDetail/eventdetail');
        if (!response.ok) throw new Error('Failed to fetch events');
        const data = await response.json();
        setEvents(data);
        if (data.length > 0) {
          setSelectedEventId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        toast({
          title: 'Error',
          description: 'Could not load events. Please try again later.',
          variant: 'destructive',
        });
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      const selectedEvent = events.find((event) => event.id === selectedEventId);
      setEventDetails(selectedEvent);
    }
  }, [selectedEventId, events]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setEventDetails((prev) => {
      const updatedField = [...prev[field]];
      updatedField[index] = value;
      return { ...prev, [field]: updatedField };
    });
  };

  const handleAgendaChange = (e, index, key) => {
    const { value } = e.target;
    setEventDetails((prev) => {
      const updatedAgenda = [...prev.agenda];
      updatedAgenda[index][key] = value;
      return { ...prev, agenda: updatedAgenda };
    });
  };

  const handleSaveEvent = async () => {
    setIsEditing(false);

    try {
      const response = await fetch('/api/adminDetail/eventdetail', {
        method: eventDetails?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails),
      });

      if (!response.ok) throw new Error('Failed to save event');

      const updatedEvent = await response.json();
      setEvents((prev) => {
        if (eventDetails?.id) {
          return prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event));
        } else {
          return [...prev, updatedEvent];
        }
      });

      toast({
        title: 'Event Saved',
        description: 'The event details have been successfully saved.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: 'Error',
        description: 'Could not save event. Please try again later.',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/adminDetail/eventdetail/${selectedEventId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to delete event');

        setEvents((prev) => prev.filter((event) => event.id !== selectedEventId));
        setEventDetails(null);
        setSelectedEventId(null);

        toast({
          title: 'Event Deleted',
          description: 'The event has been successfully deleted.',
          variant: 'success',
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        toast({
          title: 'Error',
          description: 'Could not delete event. Please try again later.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleAddNewEvent = () => {
    setEventDetails({
      id: null,
      title: '',
      description: '',
      date: '',
      location: '',
      imageUrl: '',
      highlights: [''],
      agenda: [{ time: '', session: '' }],
    });
    setSelectedEventId(null);
    setIsEditing(true);
  };

  if (!events.length && !eventDetails) {
    return <div className="text-center text-white text-2xl mt-10">Loading events...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900 to-gray-900 text-gray-100">
      <div className="container mx-auto py-12 px-6 flex-grow">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-4xl font-bold text-white">Admin Event Details</h2>
          <Button onClick={handleAddNewEvent} className="bg-green-600 hover:bg-green-700">
            Add New Event Detail
          </Button>
        </div>

        {/* Event Selector */}
        {events.length > 0 && (
          <div className="mt-4">
            <Label htmlFor="event-select" className="text-indigo-300">
              Select Event
            </Label>
            <select
              id="event-select"
              className="w-full bg-gray-800 text-white p-2 mt-2 rounded"
              value={selectedEventId || ''}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
            >
              <option value="" disabled>
                -- Select an Event --
              </option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {eventDetails && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white">
                {eventDetails.title || 'New Event'}
              </h3>
              <div>
                {isEditing ? (
                  <Button onClick={handleSaveEvent} className="mr-4">
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)} className="mr-4">
                    Edit Event
                  </Button>
                )}
                {eventDetails.id && (
                  <Button onClick={handleDelete} variant="destructive">
                    Delete Event
                  </Button>
                )}
              </div>
            </div>

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={eventDetails.title}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-4"
                />

                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={eventDetails.description}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-4"
                />

                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  value={eventDetails.date}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-4"
                />

                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={eventDetails.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-4"
                />

                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  value={eventDetails.imageUrl}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mb-4"
                />
              </div>

              <div>
                <Label>Highlights</Label>
                {eventDetails.highlights.map((highlight, index) => (
                  <Input
                    key={index}
                    value={highlight}
                    onChange={(e) => handleArrayChange(e, 'highlights', index)}
                    disabled={!isEditing}
                    className="mb-2"
                  />
                ))}

                <Label>Agenda</Label>
                {eventDetails.agenda.map((agendaItem, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 mb-2">
                    <Input
                      value={agendaItem.time}
                      onChange={(e) => handleAgendaChange(e, index, 'time')}
                      disabled={!isEditing}
                      placeholder="Time"
                    />
                    <Input
                      value={agendaItem.session}
                      onChange={(e) => handleAgendaChange(e, index, 'session')}
                      disabled={!isEditing}
                      placeholder="Session"
                    />
                    <Input
                      value={agendaItem.speaker}
                      onChange={(e) => handleAgendaChange(e, index, 'speaker')}
                      disabled={!isEditing}
                      placeholder="speaker"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventDetails;