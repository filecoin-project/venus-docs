#!/bin/bash

if [ $VENUS_COMPONENT == venus-miner ];
then
    echo "EXEC: venus-miner $@ && venus-miner run \n\n"
    venus-miner $@
    venus-miner run
else 
    echo "EXEC: $VENUS_COMPONENT  $@  \n\n"
    $VENUS_COMPONENT $@
fi 
