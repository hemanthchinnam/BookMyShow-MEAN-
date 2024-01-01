import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { UserModel } from '../models/user.model';
import { isAdmin, isAuth } from '../utils';
import { Movie, MovieModel } from '../models/movie.model';
import { movies, users } from '../sample-data';

export const movieRouter = express.Router();

movieRouter.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const name = (req.query.name || '') as string;
    const Genre = (req.query.Genre || '') as string;
    const order = (req.query.order || '') as string;
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const GenreFilter = Genre ? { Genre } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const movies = await MovieModel.find({
      ...nameFilter,
      ...GenreFilter,
      ...priceFilter,
      ...ratingFilter,
    }).sort(sortOrder);
    res.send(movies);
  })
);

movieRouter.get(
  '/paged',
  asyncHandler(async (req: Request, res: Response) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const name = (req.query.name || '') as string;
    const Genre = (req.query.Genre || '') as string;
    const order = (req.query.order || '') as string;
    const like = Number(req.query.like)|| 2;
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;

    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const GenreFilter = Genre ? { Genre } : {};
    const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {};
    const ratingFilter = rating ? { rating: { $gte: rating } } : {};
    // Assuming like is of type number | undefined
const likeFilter: { like?: { $gte: number } } = like !== undefined && like > 0 ? { like: { $gte: like }} : {};

    const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 };
    const count = await MovieModel.count({
      ...nameFilter,
      ...GenreFilter,
      ...priceFilter,
      ...ratingFilter,
      ...likeFilter,
    });
    const movies = await MovieModel.find({
      ...nameFilter,
      ...GenreFilter,
      ...priceFilter,
      ...ratingFilter,
      ...likeFilter,
    })
      .sort(sortOrder)
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ movies, page, pages: Math.ceil(count / pageSize) });
  })
);

movieRouter.get(
  '/categories',
  asyncHandler(async (req: Request, res: Response) => {
    const categories = await MovieModel.find().distinct('Genre');
    res.send(categories);
  })
);

movieRouter.get(
  '/seed',
  asyncHandler(async (req: Request, res: Response) => {
  
    const createdUsers = await UserModel.insertMany(users);
    const createdMovies = await MovieModel.insertMany(movies);
    res.send({ createdUsers, createdMovies });
  })
);

movieRouter.get(
  '/slug/:slug',
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await MovieModel.findOne({
      slug: req.params.slug,
    });
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await MovieModel.findById(req.params.id);
    if (movie) {
      res.send(movie);
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.post(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await MovieModel.create({
      name: 'sample name ' + Date.now(),
      year:0,
      image: 'string',
      price: 0,
      slug: 'sample-slug-' + Date.now(),
      Genre: 'sample genre',
      TicketsAvailable: 0,
      rating: 0,
      numReviews: 0,
      description: 'sample description',
    } as Movie);

    const createdMovie = await movie.save();
    res.send(createdMovie);
  })
);
movieRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const movieId = req.params.id;
    const movie = await MovieModel.findById(movieId);
    if (movie) {
      movie.name = req.body.name;
      movie.slug = req.body.slug;
      movie.year = req.body.year;
      movie.price = req.body.price;
      movie.image = req.body.image;
      movie.Genre = req.body.Genre;
      movie.TicketsAvailable = req.body.TicketsAvailable;
      movie.description = req.body.description;
      const updatedMovie = await movie.save();
      res.send({ message: 'Movie Updated', movie: updatedMovie });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const movie = await MovieModel.findById(req.params.id);
    if (movie) {
      const deleteMovie = await movie.remove();
      res.send({ message: 'Movie Deleted', movie: deleteMovie });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);

movieRouter.post(
  '/:id/reviews',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const movieId = req.params.id;
    const movie = await MovieModel.findById(movieId);
    if (movie) {
      if (movie.reviews.find((x) => x.name === req.user.name)) {
        return res
          .status(400)
          .send({ message: 'You already submitted a review' });
      }
      const review = {
        name: req.user.name,
        rating: Number(req.body.rating),
        comment: req.body.comment,
      };
      movie.reviews.push(review);
      movie.numReviews = movie.reviews.length;
      movie.rating =
        movie.reviews.reduce((a, c) => c.rating + a, 0) /
        movie.reviews.length;
      console.log(movie.reviews);
      const updatedMovie = await movie.save();
      res.status(201).send({
        message: 'Review Created',
        review: updatedMovie.reviews[updatedMovie.reviews.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Movie Not Found' });
    }
  })
);