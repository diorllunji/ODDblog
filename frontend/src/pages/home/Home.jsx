import PostList from "../../components/posts/PostList";
import "./home.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import {Link} from "react-router-dom";
import {useDispatch,useSelector} from "react-redux";
import { useEffect, useState,useRef } from "react";
import { fetchPosts } from "../../redux/apiCalls/postApiCall";
import { Application, Assets, Sprite, Container, Rectangle } from 'pixi.js';

const Home = () => {
    const dispatch=useDispatch();
    const {posts}=useSelector(state=>state.post);
    const initializedRef = useRef(false);

    useEffect(()=>{
        dispatch(fetchPosts(1));
    });

    useEffect(() => {
        // Check if the effect has already been executed
        if (!initializedRef.current) {
            // Set the ref to indicate that the effect has been executed
            initializedRef.current = true;

            // Initialize Pixi.js application
            const initializePixiApp = async () => {
                // Create a new application
                const app = new Application();

                // Initialize the application with a transparent background
                await app.init({ backgroundAlpha: 0, resizeTo: window });

                // Append the application canvas to the document body
                document.body.appendChild(app.canvas);

                // Load the texture (replace 'your_image_url.jpg' with your image URL)
                const texture = await Assets.load('https://cdn-icons-png.flaticon.com/512/10290/10290328.png');

                // Create a new Sprite with the texture
                const bunny = new Sprite(texture);

                // Center the sprite's anchor point
                bunny.anchor.set(0.5);

                // Move the sprite to the center of the screen
                bunny.x = app.screen.width / 2;
                bunny.y = app.screen.height / 2;

                app.stage.addChild(bunny);

                // Bring the bunny behind the "ODDBlog" header
                bunny.zIndex = -1;

                // Listen for animate update
                app.ticker.add(() => {
                    // Rotate the bunny sprite over time
                    bunny.rotation += 0.01;
                });
            };

            initializePixiApp();
        }
    }, []);
    

    return ( 
        
    <section className="home">
        <div className="home-hero-header">
            <div className="home-hero-header-layout">
                <h1 className="home-title">ODDBlog</h1>
            </div>
        </div>
        <div className="home-latest-post">Latest Posts</div>
        <div className="home-container">
            <PostList posts={posts} />
            <Sidebar  />
        </div>
        <div className="home-see-posts-link">
            <Link to="/posts" className="home-link">
                See all posts
            </Link>
        </div>
    </section> 

    );
}


export default Home;