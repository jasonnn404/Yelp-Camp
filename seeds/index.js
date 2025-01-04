const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp');


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '67734f23ca8c8bc91e5f0791',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dtj513ynu/image/upload/v1735763104/YelpCamp/tlctgghwdsy16skfejdg.jpg',
                    filename: 'YelpCamp/tlctgghwdsy16skfejdg',
                  },
                {
                    url: 'https://res.cloudinary.com/dtj513ynu/image/upload/v1735763104/YelpCamp/beqgb9pofs1iupx8z71r.jpg',
                    filename: 'YelpCamp/beqgb9pofs1iupx8z71r',
                }
              ],
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et reprehenderit consectetur suscipit ipsa dolor aliquam vitae accusantium, corrupti fugit pariatur totam distinctio, sunt corporis, reiciendis quas neque. Labore, incidunt velit.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})