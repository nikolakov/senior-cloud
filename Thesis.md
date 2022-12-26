# Questions for Technical advisor:

1. how to structure the document
2. how to properly style the document (font, font size, indentation, columns, margins, etc.)
3. how to properly cite sources
4. how to style the title page
5.

---

# Bachelors thesis Chapter 1 - Theoretical part

## Cloud services

Cloud services is a broad term, refering to a variety of services delivered on demand to end customers and/or companies via the internet. Also known as Cloud Computing, it includes all intrastructure, platforms, software, or technologies that users or applications access through the internet without requiring additional software downloads.

> These services are designed to provide easy, affordable access to applications and resources, without the need for internal infrastructure or hardware. [1]

Many of the tools employees who work with computers use today on the internet are cloud services.

Cloud services are managed by a cloud computing vendor (a.k.a provider). They are made available to customers from the provider's servers, eliminating the need for a company to build, manage and upgrade their own infrastructure and local installation of the software in order to host applications on it's own on-premises servers.

> Services that a provider makes available to numerous customers over the web are referred to as public cloud services. Public cloud providers abstract their own infrastructure, platforms, or apps from hardware they own and share them with many tenants. They can also offer public cloud services, like API management, cloud-based operating systems, or libraries of development templates known as frameworks.[2]

> Services that a provider does not make generally available to corporate users or subscribers are referred to as private cloud services. With a private cloud services model, apps and data are made available through the organization’s own internal infrastructure. The platform and software serve one company alone, and are not made available to external users. Companies that work with highly sensitive data, such as those in the healthcare and banking industries, often use private clouds to leverage advanced security protocols and extend resources in a virtualized environment as needed. [1]

When companies host their software and applications on-site, they have the responsibility to build, support and maintain the following layers of the infrastructure, on which the software runs:

- Networking
- Storage
- Servers
- Virtualization
- OS
- Middleware
- Runtime
- Data
- Applications

Based on how much of that responsibility is being offloaded to an external provider, Cloud services can be separated in three main distinct categories:

- Infrastructure-as-a-Service (IaaS)
- Platform-as-a-Service (Paas)
- Software-as-a-Service (SaaS)

![Cloud services](https://www.redhat.com/cms/managed-files/iaas-paas-saas-diagram5.1-1638x1046.png)

---

#### **Expand on each layer that is managed by the business if not using Cloud Services**

#### **Something something about being Available on-demand...**

#### **Something something about being Affordable and scalable solutions...**

#### **Something something about being distributed on a Subscription-based model...**

---

### IaaS

Infrastructure-as-a-Service is the lowest level of abstraction above providing bare-metal hardware and is the backbone of all other cloud computing services. It provides only the infrastructure that many businesses need to run their software and applications. It acomplishes that by detaching computing capabilities from hardware components, such as separating:

> - Processing power from central processing units (CPUs)
> - Active memory from random access memory (RAM) chips
> - Graphics processing from the graphics processing units (GPUs)
> - Data storage availability from datacenters or hard drives
>
> This is typically accomplished through virtualization and virtual machines. [2]

Virtualization is the concept of using software to create a virtual instance of a computer system in a layer abstracted from the physical hardware. This allows many instances to run operating systems while efficiently sharing the available hardware depending on the current load. Virtualization also introduces isolation,

> keeping programs running inside of a virtual machine safe from the processes taking place in another virtual machine on the same host. [3]

As the virtual machines completely mimic a real computer system, to the applications running on top of them it appears as if they are running on dedicated servers with OS, libraries and other programs unique to the guest system.

Once separated, the storage, compute, and networking components are provided to the customer through an Application Programming Interface (API) or a dashboard, giving IaaS clients complete control. As this kind of cloud service provides the same technologies and capabilities as a traditional data center, without having to physically maintain it, it has led to the rise of cloud storage. It serves as the complete datacenter framework, eliminating the need for resource-intensive, on-site installations.

IaaS vendors are responsible for providing and managing the Network infrastructure, hardware servers and storage, virtualization and variety of Operation System installations. This means the organization has complete control over the Operation System being used (as long as it's being offered by the vendor), Middleware, the Runtime, Data and Applications.

Marketed mainly to corporate customers, IaaS allows businesses to purchase resources on-demand and as-needed instead of having to buy hardware upfront. Infrastructure-as-a-Service is usually based on a pay-as-you-use subscription model, allowing the customer to have small upfront cost and easily scale up or down based on demand.

Most notable examples of Infrastructure-as-a-Service providers are the big three in this area - Amazon Cloud Services, Google Cloud and Microsoft Azure. Other alternatives that offer smaller variety of products, but are easier to setup and have a more moderate learning curve include DigitalOcean and Linode.

---

#### _Maybe_ Expand on this

Use cases:

- Startups and small companies may prefer IaaS to avoid spending time and money on purchasing and creating hardware and software.
- Larger companies may prefer to retain complete control over their applications and infrastructure, but they want to purchase only what they actually consume or need.
- Companies experiencing rapid growth like the scalability of IaaS, and they can change out specific hardware and software easily as their needs evolve.

Other benefits:
IaaS providers also guarantee data storage redundancy and uptime, giving customers insurance and peace of mind.

Drawbacks and limitations:

---

### PaaS

Platform-as-a-Service (PaaS) is the next level of abstraction over IaaS. A cloud platform requires more than abstracting computer capabilities from computer hardware components, as it is with Infrastructure-as-a-Service. It allows users to directly run their custom build applications on the cloud without the complexity of provisioning and managing the underlying Operating System, Middlewares or Runtime Environment.

For example, choosing the correct server option based on expected load, attaching storage, installing an Operating system and a Runtime environment (e.g. Java Virtual Machine for Java or Node.js Runtime for JavaScript applications) and maintaining them and keeping them up-to-date are all things a customer has to do for themselves when using IaaS, but not when using PaaS.

When using Platform-as-a-Service, the user can focus on developing the source code of the application and when ready to deploy, just upload it to the Platform. It's the service provider's responsibility to build and run the application, ensure it runs in the correct environment and has the necessary resources to do so. This is achieved through technologies like containerization. [2]

Containerization is a technology where software is packaged and isolated in order to provide an infrastructure- and OS-independent lightweight environment for running applications, called a container.

> Container images encapsulate an application as a single executable package of software that bundles application code together with all of the related configuration files, libraries, and dependencies required for it to run. Container images become containers at runtime. Containerized applications are “isolated” in that they do not bundle in a copy of the operating system. Instead, an open source runtime engine (such as the Docker runtime engine) is installed on the host’s operating system and becomes the conduit for containers to share an operating system with other containers on the same computing system. [4] [5]

![Containerization](https://www.docker.com/wp-content/uploads/2021/11/container-what-is-container.png.webp)
Source: https://www.docker.com/resources/what-container/

#### Say something about how this makes PaaS possible

Platforms for deploying applications on the cloud usually also provide certain automations like automatic deployment, capacity provisioning, load balancing and auto scaling and a console/UI Dashboard for health monitoring and configurations.

Many IaaS vendors, including the examples listed above, also offer PaaS capabilities. Examples of Platforms-as-a-Service include Elastic Beanstalk by Amazon Web Services, Google App Engine by Google Cloud, Heroku by Salesforce, etc.

---

### SaaS

SaaS stands for "Software as a Service" and is the most complete service a cloud provider can offer. While PaaS provides a platform for customers to develop, run, and manage their own applications, SaaS provides access to a complete software application, developed and managed by the provider, and all its underlying IT infrastructure and platforms, to end users through an internet browser or a dedicated app [1]. This means there is no need for technical expertise from the customer’s side, as they’re using a complete product.

SaaS is the most popular form of cloud service, as it can be marketed to and used by a wide variety of both business and private customers. SaaS products range from personal entertainment (e.g. Netflix) and creativity tools (Creative Cloud by Adobe) to Business and IT tools like CRM Software (Salesforce) and Service Desk Software (Jira) [6].

When buying software as a product, the customer often buys a current (for the time of purchase) version and buys all its bugs and limitations with it. Even if the seller includes future version updates in the package, it’s often for a limited amount of time and the user has to manage the version updates. Software-as-a-Service, on the other hand, is often priced as a subscription plan, where the customer buys the right to use the software for a limited amount of time and can always renew their plan if they so desire. This means that while subscribed, the user is guaranteed access to the latest version of the software, crucial security and stability updates are available as soon as they are released.

Key advantages of SaaS:

- Lower upfront cost (and risk) for new users - this is an advantage for both users and service providers. It’s better for users, because they can try the software and decide whether it’s the right one for them for a fraction of the cost. Nowadays many SaaS providers offer free trial plans, bringing the upfront cost and risks for the user to basically zero. For the service providers it’s better, because they can much more easily market to, and reach, new potential clients.
- Quick and easy setup and low maintenance - As the software runs on the provider’s infrastructure and is accessed by the user via the internet, it requires zero (or near zero) initial setup from the user’s side. Software as a service does not need to be evaluated, bought, installed, kept secure, maintained and regularly upgraded by the client or their internal IT department.
- Does not depend on the user’s hardware - No matter how big, heavy or computationally demanding the software is, the user’s hardware is used only as a gateway to the platform, so no high-cost or specialized equipment is required.
- More cost-efficient - as SaaS providers host the required infrastructure for a potentially large number of clients, they can take much better advantage of economy of scale, regarding computing and storage hardware, cost-effective infrastructure location & security, and tech support.
- High accessibility - As it’s designed to be accessed via the internet, it can be accessed from anywhere from any device with internet connectivity.
- Scalability - SaaS is often priced in subscription tiers or on pay-for-what-you-use basis, giving the client the flexibility to scale their spending based on their use case.

Key disadvantages of Saas:

- Potentially higher cost - as most SaaS providers provide not only the software, but also the infrastructure and IT & tech support necessary, usually they are not only priced in in the subscription cost, but also a source of high profit margin. Although low-scale clients often find it cost effective to use SaaS, large enterprises might save from deploying a solution in-house.
- Security - Although security should be a top-level priority for SaaS providers, as they manage actions and store data on behalf of their clients, for some critical security applications it might be crucial to eliminate the “remote access” attack vector altogether. If this is the case, SaaS might not be an option for the client.
- Compliance - Nowadays every company based in the EU or USA, which is working with user data, has to comply with regulations like GDPR (EU) and CCPA (USA). Companies that want to use SaaS must make sure the desired SaaS provider meets the necessary requirements.

---

### Other cloud services

1. DBaaS
   Database-as-a-service (DBaaS) is a type of cloud computing service that provides a database and manages it for the user. It can be considered either as a type of platform-as-a-service (PaaS) because it provides a platform for the user to store and manage their data, or as a SaaS, as the customer is using software made available by the provider [7] [8].

All of the “big three” major cloud service providers - Google, Amazon and Microsoft provide DBaaS solutions, e.g. Google Firestore [10], Amazon Aurora, Amazon RDS, Amazon DynamoDB [11], Azure Cosmos DB [12] and others.

---

### Cloud storage

Cloud storage is often considered to be a type of infrastructure as a service (IaaS). It enables storing data and files on the internet through a cloud computing provider that you access either through the public internet or a dedicated private network connection [9].

The specific details of how cloud storage is built will depend on the provider, but generally, it involves the following steps:

1. Procuring and installing the necessary hardware: This includes servers, storage devices, networking equipment, and other hardware components that are needed to create the cloud storage infrastructure.
2. Installing and configuring the necessary software: This includes the operating system, storage management software, and other software that is needed to manage and operate the cloud storage system.
3. Connecting the hardware and software components: This involves configuring the hardware and software components to work together and creating the necessary network connections to allow users to access the cloud storage system.
4. Testing and optimizing the cloud storage system: This involves testing the system to ensure it is functioning properly and making any necessary adjustments or optimizations to improve performance and reliability.
5. Building redundancy in the system, by maintaining large data centers in multiple locations around the world [9].

As it is with other Infrastructure-as-a-Service products, all this is handled by the provider, allowing the customer to focus on using the storage for their own applications.

There are several types of cloud storage based on availability:

Public cloud storage: This type of storage is provided by third-party companies such as Amazon Web Services (AWS), Microsoft Azure, and Google Cloud. The storage is available to anyone who wants to use it, and the provider is responsible for maintaining the infrastructure and ensuring its availability.
Private cloud storage: This type of storage is set up and maintained by a single organization for its own use. It is not available to the general public, and the organization is responsible for maintaining the infrastructure and ensuring its availability.
Hybrid cloud storage: This type of storage combines the benefits of both public and private cloud storage. It allows an organization to store some data in a public cloud and some data in a private cloud, depending on the needs of the organization.
Community cloud storage: This type of storage is set up and maintained by a group of organizations that have similar needs and requirements. It is not available to the general public, and the participating organizations are responsible for maintaining the infrastructure and ensuring its availability.
Multi-cloud storage: This type of storage involves the use of multiple cloud storage providers by a single organization. The organization can use different providers for different types of data or to achieve a higher level of availability and reliability.

There are several types of cloud storage based on input/output (I/O) performance:

Block storage: This type of storage is designed for storing large amounts of data that are accessed in a structured manner, such as a database or file system. It is typically used for applications that require high I/O performance, such as big data analytics or high-performance computing (HPC).

File storage: This type of storage is designed for storing and accessing files, such as documents, images, and videos. It is typically used for applications that require a high degree of file accessibility and collaboration, such as file sharing and online backup.

Object storage: This type of storage is designed for storing large amounts of unstructured data, such as photos, videos, and log files. It is typically used for applications that require high scalability and durability, such as cloud-based applications and data archiving.

Memory storage: This type of storage is designed for storing and accessing data in memory, rather than on disk. It is typically used for applications that require extremely high I/O performance, such as real-time analytics and in-memory databases.

Tape storage: This type of storage is designed for storing large amounts of data on magnetic tape. It is typically used for long-term data storage and archiving, as it is relatively inexpensive and has a long shelf life.

There are several types of cloud storage based on archiving:

Cold storage: This type of storage is designed for storing large amounts of infrequently accessed data, such as backups, archives, and rarely used files. It is typically less expensive than other types of storage, but it may have slower access times.

Deep storage: This type of storage is designed for storing large amounts of data that are not expected to be accessed again, such as historical records and long-term archives. It is typically even less expensive than cold storage, but it may have even slower access times.

Active storage: This type of storage is designed for storing data that is frequently accessed or modified, such as working files and databases. It is typically more expensive than other types of storage, but it has faster access times.

Nearline storage: This type of storage is a hybrid of cold storage and active storage. It is designed for storing data that is not accessed frequently, but that needs to be available quickly when needed. It is typically less expensive than active storage, but it has faster access times than cold storage.

Hot storage: This type of storage is designed for storing data that is accessed and modified very frequently, such as real-time data and in-memory databases. It is typically the most expensive type of storage, but it has the fastest access times.

---

## Literature

1. Citrix. _What is a cloud service?_. Retrieved December 12, 2022, from https://www.citrix.com/solutions/digital-workspace/what-is-a-cloud-service.html

2. Red Hat, (Update March 14, 2022). _What are cloud services?_. Retrieved December 12, 2022, from https://www.redhat.com/en/topics/cloud-computing/what-are-cloud-services

3. Opensource.com. _What is virtualization?_. Retrieved December 12, 2022, from https://opensource.com/resources/virtualization

4. IBM Cloud Education, (June 23, 2021). _Containerization_. Retrieved December 12, 2022 from https://www.ibm.com/cloud/learn/containerization

5. Docker. _Use containers to Build, Share and Run your applications_. Retrieved December 12, 2022 from https://www.docker.com/resources/what-container/

6. Wesley Chai (Update October, 2022). _Software as a Service (SaaS)_. Retrieved December 13, 2022 from https://www.techtarget.com/searchcloudcomputing/definition/Software-as-a-Service

7. MongoDB. _Database as a Service (DBaaS) Explained_. Retrieved December 13, 2022 from https://www.mongodb.com/database-as-a-service

8. Sebastian Insausti (August 3, 2020). _What is a DBaaS?_. Retrieved December 13, 2022 from https://severalnines.com/blog/what-is-a-dbaas/

9. Amazon Web Services. _What Is Cloud Storage?_. Retrieved December 14, 2022 from https://aws.amazon.com/what-is/cloud-storage/

10.
