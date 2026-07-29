"use client";

import React, { useState } from "react";

const StringInput = ({ onSubmit }) => {
    const [value, setValue] = useState("");

    return (
        <div>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />

            <button onClick={() => onSubmit(value)}>
                Submit
            </button>
        </div>
    );
};

export default StringInput;