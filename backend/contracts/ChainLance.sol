// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract ChainLance {
    struct Job {
        uint256 id;
        address buyer;
        address payable seller;
        uint256 price;
        bool isFunded;
        bool isCompleted;
    }

    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
    // New mapping to track seller's jobs
    mapping(address => uint256[]) public sellerJobs;

    event JobCreated(
        uint256 jobId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );
    event JobFunded(uint256 jobId, uint256 price);
    event JobCompleted(uint256 jobId, address indexed seller);
    event JobCancelled(uint256 jobId, address indexed buyer);

    modifier onlyBuyer(uint256 jobId) {
        require(
            jobs[jobId].buyer == msg.sender,
            "Only the buyer can perform this action"
        );
        _;
    }

    modifier onlySeller(uint256 jobId) {
        require(
            jobs[jobId].seller == msg.sender,
            "Only the seller can perform this action"
        );
        _;
    }

    modifier jobExists(uint256 jobId) {
        require(jobs[jobId].buyer != address(0), "Job does not exist");
        _;
    }

    function createJob(address payable seller, uint256 price) external {
        require(price > 0, "Price must be greater than zero");
        require(seller != address(0), "Invalid seller address");

        jobCounter++;

        jobs[jobCounter] = Job({
            id: jobCounter,
            buyer: msg.sender,
            seller: seller,
            price: price,
            isFunded: false,
            isCompleted: false
        });

        // Add job to seller's job list
        sellerJobs[seller].push(jobCounter);

        emit JobCreated(jobCounter, msg.sender, seller, price);
    }

    // New function to get all jobs for a seller
    function getSellerJobs(
        address seller
    ) external view returns (uint256[] memory) {
        return sellerJobs[seller];
    }

    function fundJob(
        uint256 jobId
    ) external payable jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(!job.isFunded, "Job is already funded");
        require(msg.value == job.price, "Incorrect amount sent");

        job.isFunded = true;
        emit JobFunded(jobId, msg.value);
    }

    function completeJob(
        uint256 jobId
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(job.isFunded, "Job is not funded");
        require(!job.isCompleted, "Job is already completed");

        job.isCompleted = true;
        job.seller.transfer(job.price);
        emit JobCompleted(jobId, job.seller);
    }

    function cancelJob(
        uint256 jobId
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(!job.isCompleted, "Cannot cancel a completed job");

        if (job.isFunded) {
            payable(job.buyer).transfer(job.price);
        }

        delete jobs[jobId];
        emit JobCancelled(jobId, msg.sender);
    }
}
