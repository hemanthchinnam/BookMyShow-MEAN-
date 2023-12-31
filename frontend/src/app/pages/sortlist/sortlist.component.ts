import { Component, OnInit } from '@angular/core';
import { EventService } from '../../services/event.service';
import { Event } from 'src/app/models/event';
@Component({
  selector: 'app-sortlist',
  templateUrl: './sortlist.component.html',
  styleUrls: ['./sortlist.component.css']
})
export class SortlistComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  searchText : any = '';
  currentSortOption: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.eventService.getEvents().subscribe(
      (events) => {
        this.events = events;
        this.filteredEvents = events;
      },
      (error) => {
        console.error('Error fetching events', error);
      }
    );
  }

  // ... rest of your component code



  sortBy(option: string): void {
    this.currentSortOption = option;
    this.searchText = option;

    this.filteredEvents = this.filteredEvents.sort((a, b) => {
      if (option === 'name') {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }
      if (option === 'Genre') {
        const genreA = a.Genre.toLowerCase();
        const genreB = b.Genre.toLowerCase();
        if (genreA < genreB) return -1;
        if (genreA > genreB) return 1;
        return 0;
      }
      if (option === 'slug') {
        const slugA = a.slug.toLowerCase();
        const slugB = b.slug.toLowerCase();
        if (slugA < slugB) return -1;
        if (slugA > slugB) return 1;
        return 0;
      }
      if (option === 'price') {
        const priceA = a.price;
        const priceB = b.price;
        if (priceA < priceB) return -1;
        if (priceA > priceB) return 1;
        return 0;
      }
      if (option === 'image') {
        const imageA = a.image;
        const imageB = b.image;
        if (imageA < imageB) return -1;
        if (imageA > imageB) return 1;
        return 0;
      }
      if (option === 'year') {
        const yearA = a.year;
        const yearB = b.year;
        if (yearA < yearB) return -1;
        if (yearA > yearB) return 1;
        return 0;
      }
      // Add other sorting options as needed (e.g., 'name', 'date')

      return 0; // Default case (no sorting)
    });
  }

  filterEvents(): void {
    this.filteredEvents = this.events.filter((event) => {
      const nameMatch = event.name.toLowerCase().includes(this.searchText.toLowerCase());
      const genreMatch = event.Genre.toLowerCase().includes(this.searchText.toLowerCase());
      const slugMatch = event.slug.toLowerCase().includes(this.searchText.toLowerCase());
const priceMatch = event.price;
const yearMatch = event.year;
const Image = event.image;

      return genreMatch || nameMatch || priceMatch || slugMatch || Image || yearMatch;
    });
  }
}
