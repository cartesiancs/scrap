
import React, { useEffect, useState } from "react";

import { FeedInput } from './Feed'


import Navbar from './Navbar'
import CheckSignin from './CheckSignin'


function FeedWrite() {
    return (
        <CheckSignin>
            <Navbar></Navbar>

            <FeedInput></FeedInput>
        </CheckSignin>

    );

}

export default FeedWrite;