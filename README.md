# Indonesia Administrative Areas JSON

This repository provides a JSON representation of administrative areas in Indonesia, converted from a CSV file. The source CSV file is obtained from the [kodewilayah/permendagri-72-2019](https://github.com/kodewilayah/permendagri-72-2019) repository.

## Overview

The `indonesia-administrative-areas-json` repository contains the following:

- `data.csv`: CSV file from the [kodewilayah/permendagri-72-2019](https://github.com/kodewilayah/permendagri-72-2019/blob/main/dist/base.csv) repository.
- `index.js`: JavaScript file used to convert the CSV data into JSON format.
- `data.json`: JSON file containing the converted administrative areas data.

## Getting Started

To get started with this repository, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/prave-com/indonesia-administrative-areas-json
   cd indonesia-administrative-areas-json
   ```

2. **Install dependencies:**

   Ensure you have Node.js installed, then run:

   ```sh
   npm install
   ```

3. **Convert CSV to JSON:**

   Run the conversion script to generate the JSON file:

   ```sh
   node index.js
   ```

   After running the script, you will find `data.json` in the repository.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/prave-com/indonesia-administrative-areas-json/blob/main/LICENSE)
file for details.

## Credits

The CSV file used in this repository is provided by the [kodewilayah/permendagri-72-2019](https://github.com/kodewilayah/permendagri-72-2019) repository. Thanks to the contributors for making this data available.

## Contact

For any inquiries or issues, please open an issue on the GitHub repository.
