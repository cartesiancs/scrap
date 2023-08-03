
import React, { useEffect, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'


function FeedWrite() {
    return (
        <div>
            <Navbar></Navbar>

            <FeedInput></FeedInput>
        </div>

    );

}

export default FeedWrite;