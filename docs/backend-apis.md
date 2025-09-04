# 后端接口列表

## 1. 用户管理接口

### 1.1 获取用户列表
```
GET /api/users

请求参数：
{
    "page": number,       // 页码
    "pageSize": number,  // 每页数量
    "keyword": string    // 搜索关键词（可选，支持姓名和学号搜索）
}

返回数据：
{
    "code": number,      // 状态码
    "data": {
        "total": number,  // 总数
        "list": [{
            "id": number,
            "name": string,
            "student_id": string,    // 学号
            "is_active": boolean,    // 在校状态
            "created_at": string,    // 创建时间
            "rollCallCount": number,  // 被点名次数
            "lastRollCallTime": string // 上次被点名时间
        }]
    }
}
```

### 1.2 创建用户
```
POST /api/users

请求参数：
{
    "name": string,       // 姓名
    "student_id": string, // 学号
    "is_active": boolean  // 在校状态
}

返回数据：
{
    "code": number,
    "message": string,
    "data": {
        "id": number,
        "name": string,
        "student_id": string,
        "is_active": boolean,
        "created_at": string
    }
}
```

### 1.3 更新用户
```
PUT /api/users/:id

请求参数：
{
    "name": string,       // 姓名
    "student_id": string, // 学号
    "is_active": boolean  // 在校状态
}

返回数据：
{
    "code": number,
    "message": string,
    "data": {
        "id": number,
        "name": string,
        "student_id": string,
        "is_active": boolean,
        "updated_at": string
    }
}
```

### 1.4 删除用户
```
DELETE /api/users/:id

返回数据：
{
    "code": number,
    "message": string
}
```

### 1.5 批量删除用户
```
POST /api/users/batch-delete

请求参数：
{
    "ids": number[]  // 用户ID列表
}

返回数据：
{
    "code": number,
    "message": string,
    "data": {
        "success": number,  // 成功删除数量
        "fail": number     // 失败数量
    }
}
```

### 1.6 批量导入用户
```
POST /api/users/import

请求参数：
FormData:
- file: Excel文件（支持.xlsx, .xls格式）

返回数据：
{
    "code": number,
    "message": string,
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

### 1.7 导出用户
```
GET /api/users/export

返回数据：
Excel文件（.xlsx格式）
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

### 2.2 获取随机面试官
```
GET /api/roll-call/random-interviewers

请求参数：
{
    "count": number      // 面试官数量，默认5
}

返回数据：
{
    "code": number,
    "data": [{
        "id": string,
        "name": string,
        "avatar": string,
        "title": string,
        "interviewCount": number,
        "successRate": number
    }]
}
```

### 2.3 记录面试官选择
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

### 2.4 记录面试结果
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