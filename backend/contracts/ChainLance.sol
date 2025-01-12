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
        string[] deliveryFiles; // IPFS hashes for delivered files
        bool filesAccepted; // Buyer's approval of delivered files
    }

    uint256 public jobCounter;
    mapping(uint256 => Job) public jobs;
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
    event FilesDelivered(
        uint256 jobId,
        address indexed seller,
        string[] fileHashes
    );
    event FilesAccepted(uint256 jobId, address indexed buyer);
    event FilesRejected(uint256 jobId, address indexed buyer, string reason);

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
            isCompleted: false,
            deliveryFiles: new string[](0),
            filesAccepted: false
        });

        sellerJobs[seller].push(jobCounter);
        emit JobCreated(jobCounter, msg.sender, seller, price);
    }

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

    function deliverFiles(
        uint256 jobId,
        string[] calldata fileHashes
    ) external jobExists(jobId) onlySeller(jobId) {
        Job storage job = jobs[jobId];
        require(job.isFunded, "Job is not funded");
        require(!job.isCompleted, "Job is already completed");
        require(fileHashes.length > 0, "Must provide at least one file hash");

        job.deliveryFiles = fileHashes;
        emit FilesDelivered(jobId, msg.sender, fileHashes);
    }

    function acceptDelivery(
        uint256 jobId
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(job.isFunded, "Job is not funded");
        require(!job.isCompleted, "Job is already completed");
        require(job.deliveryFiles.length > 0, "No files have been delivered");
        require(!job.filesAccepted, "Files already accepted");

        job.filesAccepted = true;
        emit FilesAccepted(jobId, msg.sender);
    }

    function rejectDelivery(
        uint256 jobId,
        string calldata reason
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(job.isFunded, "Job is not funded");
        require(!job.isCompleted, "Job is already completed");
        require(job.deliveryFiles.length > 0, "No files have been delivered");
        require(!job.filesAccepted, "Files already accepted");

        delete job.deliveryFiles;
        emit FilesRejected(jobId, msg.sender, reason);
    }

    function completeJob(
        uint256 jobId
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(job.isFunded, "Job is not funded");
        require(!job.isCompleted, "Job is already completed");
        require(job.filesAccepted, "Files must be accepted before completion");

        job.isCompleted = true;
        job.seller.transfer(job.price);
        emit JobCompleted(jobId, job.seller);
    }

    function cancelJob(
        uint256 jobId
    ) external jobExists(jobId) onlyBuyer(jobId) {
        Job storage job = jobs[jobId];
        require(!job.isCompleted, "Cannot cancel a completed job");
        require(!job.filesAccepted, "Cannot cancel after accepting files");

        if (job.isFunded) {
            payable(job.buyer).transfer(job.price);
        }
        delete jobs[jobId];
        emit JobCancelled(jobId, msg.sender);
    }

    function getJobDeliveryFiles(
        uint256 jobId
    ) external view jobExists(jobId) returns (string[] memory) {
        return jobs[jobId].deliveryFiles;
    }
}
