package com.fieldcheck.biometric.aws;

import com.fieldcheck.biometric.BiometricVerificationService;
import com.fieldcheck.biometric.VerificationResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.SdkBytes;
import software.amazon.awssdk.services.rekognition.RekognitionClient;
import software.amazon.awssdk.services.rekognition.model.*;

import java.util.List;

@Service
@Primary  // ← bean activo; cuando llegue Azure, mueve @Primary a AzureFaceVerificationService
public class AwsRekognitionVerificationService implements BiometricVerificationService {

    private final RekognitionClient rekognitionClient;
    private final String collectionId;
    private final float similarityThreshold;

    public AwsRekognitionVerificationService(
            RekognitionClient rekognitionClient,
            @Value("${aws.rekognition.collectionId}") String collectionId,
            @Value("${aws.rekognition.similarityThreshold}") float similarityThreshold) {
        this.rekognitionClient = rekognitionClient;
        this.collectionId = collectionId;
        this.similarityThreshold = similarityThreshold;
    }

    @Override
    public void initializeCollection() {
        try {
            rekognitionClient.createCollection(
                CreateCollectionRequest.builder()
                    .collectionId(collectionId)
                    .build()
            );
        } catch (ResourceAlreadyExistsException e) {
            // Collection ya existe, no es un error
        }
    }

    @Override
    public void registerFace(byte[] faceImage, String employeeId) {
        rekognitionClient.indexFaces(
            IndexFacesRequest.builder()
                .collectionId(collectionId)
                .externalImageId(employeeId)
                .image(Image.builder()
                    .bytes(SdkBytes.fromByteArray(faceImage))
                    .build())
                .maxFaces(1)
                .qualityFilter(QualityFilter.AUTO)
                .build()
        );
    }

    @Override
    public VerificationResult verify(byte[] capturedFace, String employeeId) {
        try {
            SearchFacesByImageResponse response = rekognitionClient.searchFacesByImage(
                SearchFacesByImageRequest.builder()
                    .collectionId(collectionId)
                    .faceMatchThreshold(similarityThreshold)
                    .maxFaces(1)
                    .image(Image.builder()
                        .bytes(SdkBytes.fromByteArray(capturedFace))
                        .build())
                    .build()
            );

            List<FaceMatch> matches = response.faceMatches();

            if (matches.isEmpty()) {
                return VerificationResult.failed(0f, "NO_FACE_MATCH");
            }

            FaceMatch best = matches.get(0);
            float similarity = best.similarity();
            String matchedId = best.face().externalImageId();

            if (similarity >= similarityThreshold) {
                return VerificationResult.success(similarity, matchedId);
            } else {
                return VerificationResult.failed(similarity, "BELOW_THRESHOLD");
            }

        } catch (InvalidParameterException e) {
            return VerificationResult.failed(0f, "NO_FACE_DETECTED");
        } catch (ResourceNotFoundException e) {
            initializeCollection();
            return VerificationResult.failed(0f, "COLLECTION_NOT_FOUND");
        }
    }
}