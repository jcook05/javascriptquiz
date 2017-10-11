# javascriptquiz
json driven javascript quiz.   Ideal for a standalone website on AWS S3


To run via AWS S3 Static Hosting


1.   Create an S3 bucket

2.   Update the Properties/Static Website Hosting.  Set index.html as the index document and and error.html as the error document.

3.  Publicly Accessible site:   Upload the contents of this repository and set all documents as publicly readable.  The Python put_pub_object will work.

4.  Site accessible by your router IP address range only:    Upload the contents of this repository and ensure all objects are set to readable by owner only.   Set bucket policy to restrict access to only your router range of IP addresses.  See policy below for an example. 









Python functions:


Put a public object:

 """Method to put an object with a public read ACL."""
    def put_pub_object(self, filepath, filename, bucket):

        s3 = boto3.resource('s3')


        
        try:                 
            data = open(filepath, 'rb')
            ftype, encoding = MimeTypes().guess_type(filepath)
            conType = ftype if ftype is not None else encoding if encoding is not None else 'text/plain'    
            s3.Object(bucket, filename).put(Body=data,ContentType=conType,ACL='public-read')
        except ClientError as err:
            print("Failed to upload artefact to S3.\n" + str(err))
            return False
        except IOError as err:
            print("Failed to access artefact in this directory.\n" + str(err))
            return False   
        return True
        
        
        
Put a private object

"""Method to put an object with a public read ACL."""
    def put_private_object(self, filepath, filename, bucket):

        s3 = boto3.resource('s3')


        
        try:                 
            data = open(filepath, 'rb')
            ftype, encoding = MimeTypes().guess_type(filepath)
            conType = ftype if ftype is not None else encoding if encoding is not None else 'text/plain'    
            s3.Object(bucket, filename).put(Body=data,ContentType=conType,ACL='private')
        except ClientError as err:
            print("Failed to upload artefact to S3.\n" + str(err))
            return False
        except IOError as err:
            print("Failed to access artefact in this directory.\n" + str(err))
            return False   
        return True
        
        
        
Bucket Policy



{
    "Version": "2012-10-17",
    "Id": "S3PolicyId1",
    "Statement": [
        {
            "Sid": "IPAllow",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::your.bucketname.com/*",
            "Condition": {
                "IpAddress": {
                    "aws:SourceIp": "your.router.ip.range/32"
                }
            }
        }
    ]
}
