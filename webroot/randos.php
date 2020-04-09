<?php

// Generate a random username for the connecting client
function randomUsername() {
    $ADJECTIVES = array(
        'Mr ', 'Sir',
    );

    $FIRST_NAMES = array(

        'AB', ' Abdullah ', ' Fahad ', ' Abbas ',' Hamza ',' Gulistan ',' Khalid ',' Mehmood ',' Hadi ',' Zaheer ',' Azeem ',
        );

    $LAST_NAMES = array(
        ' Ishaq ', ' Bro ', ' Bro ', ' Bro ', ' Bro ', ' Bro ',
    );



    // Choose random components of username and return it
    $adj = $ADJECTIVES[array_rand($ADJECTIVES)];
    $fn = $FIRST_NAMES[array_rand($FIRST_NAMES)];
    $ln = $LAST_NAMES[array_rand($LAST_NAMES)];


    return $adj . $fn;

}