import boto3
import json
from botocore.exceptions import ClientError

def lambda_handler(event, context):
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
    }
    # OPTIONSリクエスト (プリフライト) の処理
    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': ''
        }
    # Create a Bedrock Runtime client in the AWS Region of your choice.
    client = boto3.client("bedrock-runtime", region_name="ap-northeast-1")
    # Set the model ID
    model_id = "anthropic.claude-3-5-sonnet-20240620-v1:0"
    # Define the prompt for the model.
    prompt = event['body']
    # Format the request payload using the model's native structure.
    native_request = {
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 512,
        "temperature": 0.5,
        "messages": [
            {
                "role": "user",
                "content": [{"type": "text", "text": prompt}],
            }
        ],
    }
    # Convert the native request to JSON.
    request = json.dumps(native_request)
    try:
        # Invoke the model with the request.
        response = client.invoke_model(modelId=model_id, body=request)
    except (ClientError, Exception) as e:
        print(f"ERROR: Can't invoke '{model_id}'. Reason: {e}")
        exit(1)
    # Decode the response body.
    model_response = json.loads(response["body"].read())
    # Extract and print the response text.
    response_text = model_response["content"][0]["text"]
    print(response_text)

    return {
        'statusCode': 200,
        'headers': cors_headers,
        'body': response_text
    }