# 后端接口列表

## 1. 用户管理接口

### 1.1 获取用户列表
```
GET /api/users

请求参数：
{
    "page": number,       // 页码
    "pageSize": number,  // 每页数量
    "keyword": string    // 搜索关键词（可选）
}

返回数据：
{
    "code": number,      // 状态码
    "data": {
        "total": number,  // 总数
        "list": [{
            "id": string,
            "name": string,
            "rollCallCount": number,  // 被点名次数
            "lastRollCallTime": string // 上次被点名时间
        }]
    }
}
```

### 1.2 批量导入用户
```
POST /api/users/import

请求参数：
FormData:
- file: Excel文件

返回数据：
{
    "code": number,
    "data": {
        "successCount": number,  // 成功导入数量
        "failCount": number,    // 失败数量
        "failList": [{         // 失败列表
            "row": number,
            "reason": string
        }]
    }
}
```

## 2. 点名相关接口

### 2.1 执行随机点名
```
POST /api/roll-call/random

请求参数：
{
    "count": number      // 点名人数，默认3
}

返回数据：
{
    "code": number,
    "data": [{
        "id": string,
        "name": string,
        "rollCallCount": number
    }]
}
```

### 2.2 记录面试官选择
```
POST /api/roll-call/interviewers

请求参数：
{
    "rollCallId": string,    // 点名记录ID
    "candidateId": string,   // 被点名人ID
    "interviewerIds": string[]  // 面试官ID列表
}

返回数据：
{
    "code": number,
    "data": {
        "success": boolean
    }
}
```

### 2.3 记录面试结果
```
POST /api/roll-call/interview-result

请求参数：
{
    "rollCallId": string,     // 点名记录ID
    "candidateId": string,    // 被点名人ID
    "interviewerId": string,  // 面试官ID
    "question": string,       // 面试题
    "result": boolean        // 答题结果（true: 会，false: 不会）
}

返回数据：
{
    "code": number,
    "data": {
        "reward": {
            "interviewer": number,  // 面试官奖励
            "candidate": number     // 求职者奖励
        }
    }
}
```

## 3. 历史记录接口

### 3.1 获取点名历史
```
GET /api/roll-call/history

请求参数：
{
    "page": number,
    "pageSize": number,
    "startDate": string,    // 开始日期
    "endDate": string,      // 结束日期
    "userId": string        // 用户ID（可选）
}

返回数据：
{
    "code": number,
    "data": {
        "total": number,
        "list": [{
            "id": string,
            "date": string,
            "candidate": {
                "id": string,
                "name": string
            },
            "interviewers": [{
                "id": string,
                "name": string
            }],
            "questions": [{
                "content": string,
                "result": boolean,
                "interviewer": {
                    "id": string,
                    "name": string
                }
            }]
        }]
    }
}
```

### 3.2 导出历史记录
```
GET /api/roll-call/history/export

请求参数：
{
    "startDate": string,    // 开始日期
    "endDate": string,      // 结束日期
    "userId": string        // 用户ID（可选）
}

返回数据：
Excel文件流
```

## 4. 奖励相关接口

### 4.1 获取奖励排行榜
```
GET /api/rewards/ranking

请求参数：
{
    "type": string,        // 类型：candidate（求职者）/ interviewer（面试官）
    "timeRange": string    // 时间范围：day/week/month/all
}

返回数据：
{
    "code": number,
    "data": [{
        "id": string,
        "name": string,
        "totalReward": number,  // 总奖励金额
        "details": [{          // 奖励明细
            "date": string,
            "amount": number,
            "reason": string
        }]
    }]
}
```

## 5. 统计分析接口

### 5.1 获取面试题统计
```
GET /api/statistics/questions

请求参数：
{
    "startDate": string,
    "endDate": string
}

返回数据：
{
    "code": number,
    "data": {
        "totalQuestions": number,    // 总题目数
        "correctRate": number,       // 正确率
        "questionStats": [{          // 题目统计
            "content": string,
            "totalCount": number,
            "correctCount": number
        }]
    }
}
```

### 5.2 获取点名覆盖率
```
GET /api/statistics/coverage

请求参数：
{
    "startDate": string,
    "endDate": string
}

返回数据：
{
    "code": number,
    "data": {
        "totalUsers": number,        // 总用户数
        "coveredUsers": number,      // 已点名用户数
        "coverageRate": number,      // 覆盖率
        "uncoveredUsers": [{         // 未被点名用户
            "id": string,
            "name": string
        }]
    }
}
```