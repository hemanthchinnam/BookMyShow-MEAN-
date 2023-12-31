import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from '../models/user.model';
import { isAdmin, isAuth } from '../utils';
import { BookingModel } from '../models/booking.model';
import { MovieModel } from '../models/movie.model';

export const bookingRouter = express.Router();

bookingRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const bookings = await BookingModel.find().populate('user', 'name');
    res.send(bookings);
  })
);

bookingRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const bookings = await BookingModel.aggregate([
      {
        $group: {
          _id: null,
          numBookings: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await UserModel.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyBookings = await BookingModel.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const movieCategories = await MovieModel.aggregate([
      {
        $group: {
          _id: '$Genre',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, bookings, dailyBookings, movieCategories });
  })
);

bookingRouter.get(
  '/history',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const bookings = await BookingModel.find({ user: req.user._id });
    res.send(bookings);
  })
);

bookingRouter.post(
  '/',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    if (req.body.items.length === 0) {
      res.status(400).send({ message: 'No Movies Selected to Book' });
    } else {
      const createdBooking = await BookingModel.create({
        items: req.body.items.map((x: any) => ({ ...x, product: x._id })),
        paymentMethod: req.body.paymentMethod,
        itemsPrice: req.body.itemsPrice,
        taxPrice: req.body.taxPrice,
        totalPrice: req.body.totalPrice,
        user: req.user._id,
      });
      res.status(201).send(createdBooking);
    }
  })
);

bookingRouter.get(
  '/:id',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await BookingModel.findById(req.params.id);
    if (booking) {
      res.send(booking);
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);

bookingRouter.put(
  '/:id/pay',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await BookingModel.findById(req.params.id).populate('user');

    if (booking) {
      booking.isPaid = true;
      booking.paidAt = new Date(Date.now());
      booking.paymentResult = {
        paymentId: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedBooking = await booking.save();

      res.send(updatedBooking);
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);

bookingRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await BookingModel.findById(req.params.id);
    if (booking) {
      const deleteBooking = await booking.remove();
      res.send({ message: 'Booking Deleted', booking: deleteBooking });
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);

bookingRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const booking = await BookingModel.findById(req.params.id);
    if (booking) {
      booking.isDelivered = true;
      booking.deliveredAt = new Date(Date.now());
      // booking.deliveredAt = Date.now();

      const updatedBooking = await booking.save();
      res.send({ message: 'Booking Success', booking: updatedBooking });
    } else {
      res.status(404).send({ message: 'Booking Not Found' });
    }
  })
);
