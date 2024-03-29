package ua.com.mescherskiy.mediahosting.aws;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.services.backupstorage.model.DeleteObjectResult;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.internal.DeleteObjectsResponse;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.util.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class FileStore {

    private final static Logger logger = LoggerFactory.getLogger(FileStore.class);
    private final AmazonS3 s3;

    @Autowired
    public FileStore(AmazonS3 s3) {
        this.s3 = s3;
    }

    public void save(String path,
                     String fileName,
                     Optional<ObjectMetadata> optionalMetadata,
                     InputStream inputStream) {
//        ObjectMetadata metadata = new ObjectMetadata();
//        optionalMetadata.ifPresent(map -> {
//            if (!map.isEmpty()) {
//                map.forEach(metadata::addUserMetadata);
//            }
//        });
        try {
            s3.putObject(path, fileName, inputStream, optionalMetadata.orElse(new ObjectMetadata()));
        } catch (AmazonServiceException e) {
            throw new IllegalStateException("Failed to store file to S3", e);
        }
    }

    public byte[] download(String path, String key) {
        try {
            S3Object object = s3.getObject(path, key);
            return IOUtils.toByteArray(object.getObjectContent());
        } catch (AmazonServiceException | IOException e) {
            throw new IllegalStateException("Failed to download file from S3", e);
        }
    }

    public void delete(String path, List<String> keysToDelete) {
        for (String key : keysToDelete) {
            try {
                s3.deleteObject(new DeleteObjectRequest(path, key));
            } catch (AmazonServiceException e) {
                throw new IllegalStateException("Failed to delete files from S3", e);
            }
        }
    }

    public void deleteFolder(String bucketName, String path) {
        ObjectListing objectListing = s3.listObjects(new ListObjectsRequest().withBucketName(bucketName).withPrefix(path));

        List<S3ObjectSummary> objectsToDelete = objectListing.getObjectSummaries();
        while (objectListing.isTruncated()) {
            objectListing = s3.listNextBatchOfObjects(objectListing);
            objectsToDelete.addAll(objectListing.getObjectSummaries());
        }

        if (!CollectionUtils.isEmpty(objectsToDelete)) {
            List<DeleteObjectsRequest.KeyVersion> keysToDelete = new ArrayList<>();
            for (S3ObjectSummary objectSummary : objectsToDelete) {
                keysToDelete.add(new DeleteObjectsRequest.KeyVersion(objectSummary.getKey()));
            }

            try {
                s3.deleteObjects(new DeleteObjectsRequest(bucketName).withKeys(keysToDelete));
            } catch (AmazonServiceException e) {
                throw new IllegalStateException("Failed to delete folder from S3", e);
            }
        }
    }
}
