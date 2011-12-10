function amplitudeAsPercentage(sample) {
    if (sample < 0) {
        /* Return the value as positive  */
        return (0-sample)*100;  
    } else {
        return sample*100;
    }
}

function valueToVolume(value) {
    return (1/128)*value;
}