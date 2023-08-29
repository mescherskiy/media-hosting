package ua.com.mescherskiy.mediahosting.aws;

public enum Bucket {
    MEDIA_HOSTING("am-media-hosting-b1");

    private final String bucketName;

    Bucket(String bucketName) {
        this.bucketName = bucketName;
    }

    public String getBucketName() {
        return bucketName;
    }
}
