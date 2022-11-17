import React from "react";

import Link from "next/link";

import Image from "next/image";
import { useRouter } from "next/router";
import { category } from "../utils/initialValues";
import { GrLinkNext } from "react-icons/gr";
const mailInfo = {
  id: "reachus@humservices.org",
  subject: "Enquiry or Issue",
};
const Greeter = () => {
  const router = useRouter();
  return (
    <div className="greeter-container">
      <div className="greeter-banner-wrapper"></div>
      <div className="greeter-header">
        <h1>
          Trivandrum is Now Just a <span>Hum </span> Away
        </h1>
        <p> Building communities... and communities within communities.</p>
      </div>

      <button
        className="order-now-btn"
        onClick={() => router.replace("/account")}
      >
        Order Now <GrLinkNext />
      </button>
      <div className="banner-wrapper">
        <div className="section-header-container">
          <h1 className="section-header">
            <span>off</span> <hr /> <span>ers</span>
          </h1>
          <div className="section-info">
            <p>
              Get exclusive deals & offers on a wide range of products at
              Hum-IISER at the best price online. Find impressive deals on
              bestseller items from popular stores.
            </p>
          </div>
        </div>

        <div className="banner-slider">
          <div className="slide slide-1">
            <Image
              src={"/loginhum.jpg"}
              alt="banner"
              width="1000"
              height="700"
            />
          </div>
        </div>
      </div>

      <div className="greeter-info-container">
        <div className="section-header-container">
          <h1 className="section-header">
            <span>Ser</span> <hr /> <span>vices</span>
          </h1>
          <div className="section-info">
            <p>
              The services that we offer range from Supermarket and Restaurant
              to local couriers. The company provides credible services for
              customers of IISER.
            </p>
          </div>
        </div>

        <div className="greeter-info">
          <div className="greeter-info-img">
            <div className="greeter-info-content">
              <h3>Food, Groceries and everything in between</h3>
              <p>We deliver to IISER twice a week, Saturdays and Sundays.</p>
            </div>
            <Image src="/foodDelivery.jpg" fill={true} alt="delivery" />
          </div>
          <div className="greeter-info-img">
            <div className="greeter-info-content">
              <h3>A wide variety of stores</h3>
              <p>Choose your orders from an array of stores. </p>
            </div>
            <Image src="/stores.jpg" fill={true} alt="delivery" />
          </div>
          <div className="greeter-info-img">
            <div className="greeter-info-content">
              <h3>Track your Parcels</h3>
              <p>
                For Amazon | Flipkart orders, use the following address with
                your name and number. Do share the OTP with us as soon as you
                get it.
              </p>
            </div>
            <Image src="/parcelDelivery.jpg" fill={true} alt="delivery" />
          </div>
          <div className="greeter-info-img">
            <div className="greeter-info-content">
              <h3>Easy to pay transactions</h3>
              <p>Pay for your orders seamlessly</p>
            </div>
            <Image src="/payDelivery.jpg" fill={true} alt="delivery" />
          </div>
        </div>
      </div>

      <div className="contact-container">
        <h1 className="section-header">
          <span>Cont</span> <hr /> <span>act</span>
        </h1>
        <div className="contact-content">
          <div className="contact-content-lb">
            <h2>Get in Touch</h2>
            <p>
              Choose from a wide variety of stores and supermarkets to purchase
              from. All you need to do is, Tell us where to go, What needs to be
              done and when.
            </p>
          </div>
          <div className="contact-links">
            <div className="contact-icon-wrapper">
              <Link
                href={`https://wa.me/+919400200462`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Whatsapp
              </Link>
            </div>
            <div className="contact-icon-wrapper">
              <Link href={`mailto:${mailInfo.id}?subject=${mailInfo.subject}`}>
                Mail Us
              </Link>
            </div>
            <div className="contact-icon-wrapper">
              <Link href="https://www.google.com/maps/place/HUM+Services/@8.544003,76.941334,16z/data=!4m5!3m4!1s0x0:0xc678b6d2dd551d4c!8m2!3d8.5440035!4d76.9413335?hl=en">
                Find Us
              </Link>
            </div>
          </div>
        </div>

        <div className="hum-footer-banner">
          <h2>HUM IISER</h2>
        </div>
      </div>
    </div>
  );
};

export default Greeter;
