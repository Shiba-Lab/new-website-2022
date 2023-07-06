import openai
openai.api_key = ""

res = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {
            "role": "system",
            "content": "answer in Japanese"
        },
        {
            "role": "user",
            "content": "What is Shibaura Institute of Technology?"
        },
        {
            "role": "assistant",
            "content": "\u829d\u6d66\u5de5\u696d\u5927\u5b66\u306f\u3001\u65e5\u672c\u306e\u79c1\u7acb\u5de5\u696d\u5927\u5b66\u3067\u3001\u6771\u4eac\u90fd\u6e2f\u533a\u306b\u30ad\u30e3\u30f3\u30d1\u30b9\u3092\u6301\u3064\u5927\u5b66\u3067\u3059\u30021914\u5e74\u306b\u5275\u7acb\u3055\u308c\u3001\u5de5\u5b66\u3001\u79d1\u5b66\u3001\u5efa\u7bc9\u5b66\u3001\u4eba\u6587\u793e\u4f1a\u79d1\u5b66\u3001\u30c7\u30b6\u30a4\u30f3\u306e5\u3064\u306e\u5b66\u90e8\u3092\u6709\u3057\u3066\u3044\u307e\u3059\u3002\u307e\u305f\u3001\u56fd\u969b\u4ea4\u6d41\u3084\u7523\u5b66\u5354\u540c\u306b\u3082\u529b\u3092\u5165\u308c\u3066\u304a\u308a\u3001\u30b0\u30ed\u30fc\u30d0\u30eb\u306a\u8996\u91ce\u3092\u6301\u3063\u305f\u4eba\u6750\u306e\u80b2\u6210\u306b\u6ce8\u529b\u3057\u3066\u3044\u307e\u3059\u3002"
        },
        {
            "role": "user",
            "content": "SIT does not have any faculty of management. Answer in English."
        }
    ],
)

print(res)