## 可选类型 (`Partial<T>`)

- 定义

```ts
type Partial<T> = {
    [P in keyof T]?: T[P];
}
```

- 用法

```ts
interface Person {
    name: string
    age: number
}

// 会报错：Type '{}' is missing the following properties from type 'Person': name, age
// let person: Person = {}

// 使用 Partial 映射后返回的新类型，name 和 age 都变成了可选属性
let person: Partial<Person> = {}

person = { name: 'pengzu', age: 800 }

person = { name: 'z' }

person = { age: 18 }
```