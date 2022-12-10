# Questions for Technical advisor:

1. how to structure the document
2. how to properly style the document (font, font size, indentation, columns, margins, etc.)
3. how to properly cite sources
4.

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

### SaaS

---

## Literature

1. Citrix. _What is a cloud service?_. Retrieved December 12, 2022, from https://www.citrix.com/solutions/digital-workspace/what-is-a-cloud-service.html

2. Red Hat, (Update March 14, 2022). _What are cloud services?_. Retrieved December 12, 2022, from https://www.redhat.com/en/topics/cloud-computing/what-are-cloud-services

3. Opensource.com. _What is virtualization?_. Retrieved December 12, 2022, from https://opensource.com/resources/virtualization

4. IBM Cloud Education, (June 23, 2021). _Containerization_. Retrieved December 12, 2022 from https://www.ibm.com/cloud/learn/containerization

5. Docker. _Use containers to Build, Share and Run your applications_. Retrieved December 12, 2022 from https://www.docker.com/resources/what-container/
