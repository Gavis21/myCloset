import { Request, Response } from "express";
import axios from "axios";

const explore = async (req: Request, res: Response) => {
    try {
        console.log(`Getting random outfits for exploring`);
        const randomPageNum = Math.floor((Math.random() + 1) * 5);
        console.log(`page: ${randomPageNum}`)
        const response = await axios.get(`https://api.pexels.com/v1/search?query=fashion&page=${randomPageNum}&per_page=30`, { headers: { Authorization: process.env.OUTFITS_API_KEY}});
    
        return res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).send(error)
    }
}

export default {
    explore
}