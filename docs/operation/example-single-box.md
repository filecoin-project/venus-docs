## Venus Single box setup

This is an exmaple venus single box setup that is estimated to grow 1TiB power per day. 

## Specs

| Parts              | Recommendation      |
| ------------------ | ------------------- |
| CPU                | 3970X * 1 (32 core) |
| RAM                | 512G                |
| NVMe (for sealing) | 3T/SSD              |
| SSD (for OS)       | 500G                |
| GPU                | RTX 3080 * 1        |

## Job scheduling

| Task           | Core limit | Minutes | RAM(G) | Hourly production rate | Daily growth(T) |
| -------------- | ---------- | ------- | ------ | ---------------------- | --------------- |
| P1 * 5         | 20         | 220     | 376    | 1.3636                 | 1.0227          |
| AP, P2, Commit | 12         | 10      | 120    | 3                      | 1.125           |

For more information on core limit, please refer to the next tutorial.
